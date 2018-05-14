import React, { Component } from "react";
import merge from "lodash/merge";
import DigitalSignature from "@ehealth/react-iit-digital-signature";
import {
  Async,
  Connect,
  Form,
  Redirect,
  SUBMIT_ERROR
} from "@ehealth/components";
import { pickProps } from "@ehealth/utils";

import {
  REACT_APP_DIGITAL_SIGNATURE_ENABLED,
  REACT_APP_PATIENT_ACCOUNT_CLIENT_ID
} from "../../../env";
import { getTokenData } from "../../../reducers";
import { fetchDictionaries } from "../../../redux/dictionaries";
import { sendOtp, register } from "../../../redux/cabinet";
import { login } from "../../../redux/session";
import { authorize } from "../../../redux/auth";

const ENTRIES_PAGES_MAPPING = [
  [["$.password"], "/sign-up/user"],
  [["$.otp"], "/sign-up/otp"]
];

const STEP_FORM_PROPS = ["initialValues", "step", "transitions", "onSubmit"];

const SignUpNextPage = ({ children, location, router }) => (
  <Connect
    mapStateToProps={state => ({ tokenData: getTokenData(state) })}
    mapDispatchToProps={{
      fetchDictionaries,
      sendOtp,
      registerUser,
      authorizeUser
    }}
  >
    {({
      tokenData,
      fetchDictionaries,
      sendOtp,
      registerUser,
      authorizeUser
    }) => (
      <Async await={fetchDictionaries}>
        <DigitalSignature.Consumer>
          {({ keyAvailable, ds }) =>
            tokenData && keyAvailable ? (
              <SignUpNextForm
                initialValues={{
                  person: {
                    last_name: ds.privKeySubject.SN,
                    email: tokenData.email,
                    tax_id: ds.privKeyOwnerInfo.subjDRFOCode,
                    emergency_contact: { phones: [{ type: "MOBILE" }] },
                    authentication_methods: [{ type: "OTP" }]
                  },
                  local: {
                    document: { type: "PASSPORT" },
                    contactPhoneMatchesAuth: true
                  }
                }}
                step={location.pathname.replace("/sign-up/", "")}
                transitions={{
                  person: () =>
                    router.push({ ...location, pathname: "/sign-up/user" }),
                  user: async ({ person }) => {
                    try {
                      const { error, payload: { response } } = await sendOtp({
                        factor: person.authentication_methods[0].phone_number,
                        type: "SMS"
                      });

                      if (error) throw response.error;
                      router.push({ ...location, pathname: "/sign-up/otp" });
                    } catch (error) {
                      if (error.type === "validation_failed") {
                        return { [SUBMIT_ERROR]: error.invalid };
                      }

                      router.push({
                        ...location,
                        pathname: `/sign-up/failure/${error.type}`
                      });
                    }
                  }
                }}
                onSubmit={async ({ password, otp, ...personData }) => {
                  try {
                    const content = getPersonContent(personData);
                    const signed_content = REACT_APP_DIGITAL_SIGNATURE_ENABLED
                      ? ds.SignDataInternal(true, content, true)
                      : btoa(unescape(encodeURIComponent(content)));

                    await registerUser({
                      signed_content,
                      password,
                      otp,
                      drfo: ds.privKeyOwnerInfo.subjDRFOCode,
                      given_name: encodeURIComponent(
                        ds.privKeySubject.GivenName
                      ),
                      surname: encodeURIComponent(ds.privKeySubject.SN)
                    });

                    return authorizeUser();
                  } catch (error) {
                    if (error.type === "validation_failed") {
                      const pathname = findErroredPage(error.invalid);

                      if (pathname) {
                        router.replace({ ...location, pathname });
                        return { [SUBMIT_ERROR]: error.invalid };
                      }
                    }

                    router.push({
                      ...location,
                      pathname: `/sign-up/failure/${error.type}`
                    });
                  }
                }}
              >
                {children}
              </SignUpNextForm>
            ) : (
              <Redirect to={{ ...location, pathname: "/sign-up/continue" }} />
            )
          }
        </DigitalSignature.Consumer>
      </Async>
    )}
  </Connect>
);

export default SignUpNextPage;

class SignUpNextForm extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    return merge(prevState, { values: nextProps.initialValues });
  }

  state = {};

  render() {
    const [_, props] = pickProps(this.props, STEP_FORM_PROPS);

    return (
      <Form
        {...props}
        initialValues={this.state.values}
        onSubmit={this.handleSubmit}
      />
    );
  }

  handleSubmit = (values, form) => {
    const { step, transitions, onSubmit } = this.props;
    const transition = transitions[step];

    this.setState({ values });

    const { submitErrors } = form.getState();

    return transition
      ? transition(values, form) || submitErrors
      : onSubmit(values, form);
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
  const { error, payload: { response, data } } = await dispatch(
    register(payload)
  );

  if (error) throw response.error;

  return dispatch(login(data.access_token));
};

const authorizeUser = () => async dispatch => {
  const { error, payload: { response, headers } } = await dispatch(
    authorize({ clientId: REACT_APP_PATIENT_ACCOUNT_CLIENT_ID })
  );

  if (error) throw response.error;

  window.location = headers.get("location");
};

const findErroredPage = invalid => {
  const [_entries, path] =
    ENTRIES_PAGES_MAPPING.find(([entries]) =>
      invalid.some(e => entries.includes(e.entry))
    ) || [];

  return path;
};
