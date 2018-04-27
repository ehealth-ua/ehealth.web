import React, { Component } from "react";
import merge from "lodash/merge";
import DigitalSignature from "@ehealth/react-iit-digital-signature";
import { Async, Connect, Form, Redirect } from "@ehealth/components";
import { pickProps } from "@ehealth/utils";

import {
  REACT_APP_DIGITAL_SIGNATURE_ENABLED,
  REACT_APP_CABINET_CLIENT_ID
} from "../../../env";
import { getTokenData } from "../../../reducers";
import { fetchDictionaries } from "../../../redux/dictionaries";
import { sendOtp, register } from "../../../redux/cabinet";
import { login } from "../../../redux/session";
import { authorize } from "../../../redux/auth";

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
                  user: async values => {
                    const {
                      person: {
                        authentication_methods: [{ phone_number: factor }]
                      }
                    } = values;

                    const { error, payload: { response } } = await sendOtp({
                      factor,
                      type: "SMS"
                    });

                    if (error) {
                      if (response.error.type === "validation_failed") {
                        return {
                          person: {
                            authentication_methods: [
                              { phone_number: "Невірний номер телефону" }
                            ]
                          }
                        };
                      } else {
                        router.push({
                          ...location,
                          pathname: `/sign-up/failure/${response.error.type}`
                        });
                      }
                    } else {
                      router.push({ ...location, pathname: "/sign-up/otp" });
                    }
                  }
                }}
                onSubmit={async ({ password, otp, ...personData }) => {
                  const content = getPersonContent(personData);
                  const signed_content = REACT_APP_DIGITAL_SIGNATURE_ENABLED
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

  handleSubmit = values => {
    const { step, transitions, onSubmit } = this.props;
    const transition = transitions[step];

    this.setState({ values });
    return transition ? transition(values) : onSubmit(values);
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

  return login(data.access_token);
};

const authorizeUser = () => async dispatch => {
  const { error, payload: { response, headers } } = await dispatch(
    authorize({ clientId: REACT_APP_CABINET_CLIENT_ID })
  );

  if (error) throw response.error;

  window.location = headers.get("location");
};
