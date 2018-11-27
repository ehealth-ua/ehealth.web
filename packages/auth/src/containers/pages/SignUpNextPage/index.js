import React, { Component } from "react";
import jwtDecode from "jwt-decode";
import {
  Async,
  Connect,
  StepForm,
  Redirect,
  SUBMIT_ERROR
} from "@ehealth/components";
import DigitalSignature from "@ehealth/react-iit-digital-signature";

import env from "../../../env";
import { fetchDictionaries } from "../../../redux/dictionaries";
import { sendOtp, register } from "../../../redux/cabinet";
import { login } from "../../../redux/session";
import { authorize } from "../../../redux/auth";

const ENTRIES_PAGES_MAPPING = [
  [["$.password"], "/sign-up/user"],
  [["$.otp"], "/sign-up/otp"]
];

const SignUpNextPage = props => (
  <DigitalSignature.Consumer>
    {({ keyAvailable, ds }) =>
      keyAvailable ? (
        <Connect
          mapDispatchToProps={{
            fetchDictionaries,
            sendOtp,
            registerUser,
            authorizeUser
          }}
        >
          {({ fetchDictionaries, ...actions }) => (
            <Async await={fetchDictionaries}>
              <SignUpNextForm {...actions} {...props} ds={ds} />
            </Async>
          )}
        </Connect>
      ) : (
        <Redirect to={{ ...props.location, pathname: "/sign-up/continue" }} />
      )
    }
  </DigitalSignature.Consumer>
);

export default SignUpNextPage;

class SignUpNextForm extends Component {
  render() {
    return (
      <StepForm
        initialValues={this.initialValues}
        step={this.currentStep}
        transitions={{
          person: this.personTransition,
          user: this.userTransition
        }}
        onSubmit={this.handleSubmit}
      >
        {this.props.children}
      </StepForm>
    );
  }

  get initialValues() {
    const {
      ds: { privKeySubject, privKeyOwnerInfo }
    } = this.props;
    const { email } = this.tokenData;

    return {
      person: {
        last_name: privKeySubject.SN,
        email,
        tax_id: privKeyOwnerInfo.subjDRFOCode,
        emergency_contact: { phones: [{ type: "MOBILE" }] },
        authentication_methods: [{ type: "OTP" }]
      },
      local: {
        document: { type: "PASSPORT" },
        contactPhoneMatchesAuth: true
      }
    };
  }

  get currentStep() {
    return this.props.location.pathname.replace("/sign-up/", "");
  }

  get tokenData() {
    try {
      return jwtDecode(this.props.location.query.token);
    } catch (e) {
      return {};
    }
  }

  personTransition = () => {
    const { router, location } = this.props;
    router.push({ ...location, pathname: "/sign-up/user" });
  };

  userTransition = async ({ person }) => {
    const { sendOtp, router, location } = this.props;

    try {
      const {
        error,
        payload: { response }
      } = await sendOtp({
        factor: person.authentication_methods[0].phone_number,
        type: "SMS"
      });

      if (error) throw response.error;
      router.push({ ...location, pathname: "/sign-up/otp" });
    } catch (error) {
      return this.handleFailure(error);
    }
  };

  handleSubmit = async ({ password, otp, ...personData }) => {
    const { ds, registerUser, authorizeUser } = this.props;

    try {
      const content = getPersonContent(personData);
      const signed_content = env.REACT_APP_DIGITAL_SIGNATURE_ENABLED
        ? ds.SignDataInternal(true, content, true)
        : btoa(unescape(encodeURIComponent(content)));

      await registerUser({
        signed_content,
        password,
        otp,
        drfo: ds.privKeyOwnerInfo.subjDRFOCode,
        given_name: encodeURIComponent(ds.privKeySubject.GivenName),
        surname: encodeURIComponent(ds.privKeySubject.SN)
      });

      return authorizeUser();
    } catch (error) {
      return this.handleFailure(error);
    }
  };

  handleFailure = error => {
    const { router, location } = this.props;

    if (error.type === "validation_failed") {
      const pathname = findErroredPage(error.invalid);

      if (pathname) {
        router.replace({ ...location, pathname });
        return { [SUBMIT_ERROR]: error.invalid };
      }
    }

    router.push({ ...location, pathname: `/sign-up/failure/${error.type}` });
  };
}

const getPersonContent = formData => {
  const { local, person } = formData;

  const addresses = calculateAddresses(
    local.addresses,
    local.residenceAddressMatchesRegistration
  );

  const documents = calculateDocuments(local.document);

  const phones = calculatePhones(
    local.contactPhoneNumber,
    person.authentication_methods[0].phone_number,
    local.contactPhoneMatchesAuth
  );

  return JSON.stringify({
    ...person,
    addresses,
    documents,
    phones
  });
};

const calculateAddresses = (addresses, residenceMatchesRegistration) => {
  if (residenceMatchesRegistration) {
    addresses.RESIDENCE = addresses.REGISTRATION;
  }

  return Object.entries(addresses).map(
    ([type, { settlement, ...address }]) => ({
      type,
      country: "УКРАЇНА",
      ...settlement,
      ...address
    })
  );
};

const calculateDocuments = ({ series, number, ...document }) => [
  { ...document, number: [series, number].filter(Boolean).join("") }
];

const calculatePhones = (
  contactPhoneNumber,
  authPhoneNumber,
  contactMatchesAuth
) => [
  {
    type: "MOBILE",
    number: contactMatchesAuth ? authPhoneNumber : contactPhoneNumber
  }
];

const registerUser = payload => async dispatch => {
  const {
    error,
    payload: { response, data }
  } = await dispatch(register(payload));

  if (error) throw response.error;

  return dispatch(login(data.access_token));
};

const authorizeUser = () => async dispatch => {
  const {
    error,
    payload: { response, headers }
  } = await dispatch(
    authorize({
      clientId: env.REACT_APP_PATIENT_ACCOUNT_CLIENT_ID,
      redirectUri: env.REACT_APP_PATIENT_ACCOUNT_REDIRECT_URI
    })
  );

  if (error) throw response.error;

  window.location = headers.get("location");
};

const findErroredPage = invalid => {
  const [, path] =
    ENTRIES_PAGES_MAPPING.find(([entries]) =>
      invalid.some(e => entries.includes(e.entry))
    ) || [];

  return path;
};
