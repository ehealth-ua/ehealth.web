# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.9.3"></a>
## [1.9.3](https://github.com/edenlabllc/ehealth.web/compare/v1.9.2...v1.9.3) (2018-12-10)


### Bug Fixes

* **admin:** rename Queries for the Capitation Contracts, according to the updated scheme ([dc1af41](https://github.com/edenlabllc/ehealth.web/commit/dc1af41))





<a name="1.9.2"></a>
## [1.9.2](https://github.com/edenlabllc/ehealth.web/compare/v1.9.1...v1.9.2) (2018-12-10)

**Note:** Version bump only for package @ehealth/admin





<a name="1.9.1"></a>
## [1.9.1](https://github.com/edenlabllc/ehealth.web/compare/v1.9.0...v1.9.1) (2018-12-07)


### Bug Fixes

* **admin:** delete credentials from query on dictionaries ([1846d9a](https://github.com/edenlabllc/ehealth.web/commit/1846d9a))





<a name="1.9.0"></a>
# [1.9.0](https://github.com/edenlabllc/ehealth.web/compare/v1.8.1...v1.9.0) (2018-12-07)


### Bug Fixes

* **admin:** add preload component with dictionaries query, change query in DictionaryValue component ([f43e219](https://github.com/edenlabllc/ehealth.web/commit/f43e219))
* **admin:** change PAYMENT_METHOD to CONTRACT_PAYMENT_METHOD in dictionaryValue in contract and contractRequest ([f3e001f](https://github.com/edenlabllc/ehealth.web/commit/f3e001f))


### Features

* **admin:** add dictionaries for position and doctorSpecialities in LE details ([5d0545d](https://github.com/edenlabllc/ehealth.web/commit/5d0545d))





<a name="1.8.1"></a>
## [1.8.1](https://github.com/edenlabllc/ehealth.web/compare/v1.8.0...v1.8.1) (2018-12-07)

**Note:** Version bump only for package @ehealth/admin





<a name="1.8.0"></a>
# [1.8.0](https://github.com/edenlabllc/ehealth.web/compare/v1.7.0...v1.8.0) (2018-12-07)


### Bug Fixes

* **admin:** add DictionaryValue in contractRequests, for paymentMethod, medicalService, specialityType ([de565cd](https://github.com/edenlabllc/ehealth.web/commit/de565cd))
* **admin:** add DictionaryValue in contracts, for paymentMethod, medicalService, specialityType ([5db8b8b](https://github.com/edenlabllc/ehealth.web/commit/5db8b8b))
* **admin:** add DictionaryValue in LE, for leType, leStatus, accreditationCategory, legalForm, kveds ([b8d3af3](https://github.com/edenlabllc/ehealth.web/commit/b8d3af3))
* **admin:** add DictionaryValue to AddressView for settlementType and streetType ([b587d22](https://github.com/edenlabllc/ehealth.web/commit/b587d22))
* **admin:** delete useless statuses in helpers ([1385edc](https://github.com/edenlabllc/ehealth.web/commit/1385edc))


### Features

* **admin:** add component DictionaryValue ([8ac0545](https://github.com/edenlabllc/ehealth.web/commit/8ac0545))





<a name="1.7.0"></a>
# [1.7.0](https://github.com/edenlabllc/ehealth.web/compare/v1.6.1...v1.7.0) (2018-12-07)


### Bug Fixes

* **admin:** fix search form on contracts ([d1235fc](https://github.com/edenlabllc/ehealth.web/commit/d1235fc))


### Features

* **admin:** add props minDate for DatePicker component ([34aa5ba](https://github.com/edenlabllc/ehealth.web/commit/34aa5ba))





<a name="1.6.1"></a>
## [1.6.1](https://github.com/edenlabllc/ehealth.web/compare/v1.6.0...v1.6.1) (2018-12-07)


### Bug Fixes

* **admin:** remove timeout from error popup, fix error description ([cfcd8b1](https://github.com/edenlabllc/ehealth.web/commit/cfcd8b1))





<a name="1.6.0"></a>
# [1.6.0](https://github.com/edenlabllc/ehealth.web/compare/v1.5.6...v1.6.0) (2018-12-06)


### Features

* **admin:** change errors view from separate page to popup, add error details ([#563](https://github.com/edenlabllc/ehealth.web/issues/563)) ([9ab2182](https://github.com/edenlabllc/ehealth.web/commit/9ab2182))





<a name="1.5.6"></a>
## [1.5.6](https://github.com/edenlabllc/ehealth.web/compare/v1.5.5...v1.5.6) (2018-12-06)

**Note:** Version bump only for package @ehealth/admin





<a name="1.5.5"></a>
## [1.5.5](https://github.com/edenlabllc/ehealth.web/compare/v1.5.4...v1.5.5) (2018-12-06)


### Bug Fixes

* **admin:** remove unused variable nhsReviewed in nhsReviewLegalEntity input ([8ef961a](https://github.com/edenlabllc/ehealth.web/commit/8ef961a))





<a name="1.5.4"></a>
## [1.5.4](https://github.com/edenlabllc/ehealth.web/compare/v1.5.3...v1.5.4) (2018-12-06)


### Bug Fixes

* **admin:** add pre-line formatting for the NHS comment ([#564](https://github.com/edenlabllc/ehealth.web/issues/564)) ([45dc89d](https://github.com/edenlabllc/ehealth.web/commit/45dc89d))





<a name="1.5.3"></a>
## [1.5.3](https://github.com/edenlabllc/ehealth.web/compare/v1.5.2...v1.5.3) (2018-12-06)


### Bug Fixes

* **admin:** remove pagination params after form submitting, fix filter by dates on Contracts list, check for the filter key before form autosubmit on Dictionaries list ([226fb7f](https://github.com/edenlabllc/ehealth.web/commit/226fb7f))





<a name="1.5.2"></a>
## [1.5.2](https://github.com/edenlabllc/ehealth.web/compare/v1.5.1...v1.5.2) (2018-12-05)


### Bug Fixes

* **admin:** change maxlength to 3000 symbols for the Decline ContractRequest and Terminate Contract fields ([944dad6](https://github.com/edenlabllc/ehealth.web/commit/944dad6))





<a name="1.5.1"></a>
## [1.5.1](https://github.com/edenlabllc/ehealth.web/compare/v1.5.0...v1.5.1) (2018-12-05)

**Note:** Version bump only for package @ehealth/admin





<a name="1.5.0"></a>
# [1.5.0](https://github.com/edenlabllc/ehealth.web/compare/v1.4.0...v1.5.0) (2018-12-04)


### Bug Fixes

* **admin:** add clean arg to lingui:extract command ([0c2a69c](https://github.com/edenlabllc/ehealth.web/commit/0c2a69c))


### Features

* **admin:** localize nav ([126f179](https://github.com/edenlabllc/ehealth.web/commit/126f179))





<a name="1.4.0"></a>
# [1.4.0](https://github.com/edenlabllc/ehealth.web/compare/v1.3.0...v1.4.0) (2018-12-04)


### Bug Fixes

* **admin:** fix line component width ([8a30ab1](https://github.com/edenlabllc/ehealth.web/commit/8a30ab1))
* **admin:** fix onBlur in DateField and add default props placement ([362817a](https://github.com/edenlabllc/ehealth.web/commit/362817a))


### Features

* **admin:** add new filter item to contract list ([ee94473](https://github.com/edenlabllc/ehealth.web/commit/ee94473))
* **admin:** add prolongate form to contract details ([729c09e](https://github.com/edenlabllc/ehealth.web/commit/729c09e))
* **admin:** change filter view in contracts list ([6320604](https://github.com/edenlabllc/ehealth.web/commit/6320604))





<a name="1.2.0"></a>
# [1.2.0](https://github.com/edenlabllc/ehealth.web/compare/v1.1.0...v1.2.0) (2018-12-04)


### Bug Fixes

* **admin:** add loader for graphql queries, reorder imports, remove unused imports and props ([#551](https://github.com/edenlabllc/ehealth.web/issues/551)) ([0dfffbc](https://github.com/edenlabllc/ehealth.web/commit/0dfffbc))


### Features

* **admin:** add new fields to the Legal Entity Details page ([#554](https://github.com/edenlabllc/ehealth.web/issues/554)) ([305ff58](https://github.com/edenlabllc/ehealth.web/commit/305ff58))





<a name="1.1.0"></a>
# [1.1.0](https://github.com/edenlabllc/ehealth.web/compare/v1.0.0...v1.1.0) (2018-12-04)


### Features

* **admin:** add new logic for LE Verify, Decline and Commenting ([5f19ee3](https://github.com/edenlabllc/ehealth.web/commit/5f19ee3))
* **admin:** add NHS Review and NHS Comment mutations ([1220a80](https://github.com/edenlabllc/ehealth.web/commit/1220a80))
* **admin:** add Unverify ability for NHS, add boolean nhsVerified value to nhsVerify mutation ([8f9e23e](https://github.com/edenlabllc/ehealth.web/commit/8f9e23e))





<a name="1.0.0"></a>
# [1.0.0](https://github.com/edenlabllc/ehealth.web/compare/v0.147.0...v1.0.0) (2018-12-04)


### Code Refactoring

* **admin:** rename contract requests to capitation contract requests ([9c3644a](https://github.com/edenlabllc/ehealth.web/commit/9c3644a))


### BREAKING CHANGES

* **admin:** contract requests was renamed to capitation contract requests





<a name="0.147.0"></a>
# [0.147.0](https://github.com/edenlabllc/ehealth.web/compare/v0.146.1...v0.147.0) (2018-11-30)


### Bug Fixes

* **admin:** add graphql loader to home page ([bbf0583](https://github.com/edenlabllc/ehealth.web/commit/bbf0583))
* add additional flag to npm config, move babel/cli to dependencies, add pretest and prepare commands ([dabfc86](https://github.com/edenlabllc/ehealth.web/commit/dabfc86))
* fix unit tests ([1ffe29e](https://github.com/edenlabllc/ehealth.web/commit/1ffe29e))
* remove react-app-polyfill ([710a7bd](https://github.com/edenlabllc/ehealth.web/commit/710a7bd))
* rename scripts ([e6fdf27](https://github.com/edenlabllc/ehealth.web/commit/e6fdf27))


### Features

* **admin:** setup localization ([78ec846](https://github.com/edenlabllc/ehealth.web/commit/78ec846))
* update CRA, refactor all related code ([4c43df8](https://github.com/edenlabllc/ehealth.web/commit/4c43df8))





<a name="0.146.0"></a>
# [0.146.0](https://github.com/edenlabllc/ehealth.web/compare/v0.145.3...v0.146.0) (2018-11-28)


### Bug Fixes

* **admin:** add maxlength prop to the statusReason fields on Decline Contract Request and Terminate Contract pages ([54805c5](https://github.com/edenlabllc/ehealth.web/commit/54805c5))


### Features

* **admin:** add symbols left hint, based on maxlength prop ([1cbbd13](https://github.com/edenlabllc/ehealth.web/commit/1cbbd13))





<a name="0.145.3"></a>
## [0.145.3](https://github.com/edenlabllc/ehealth.web/compare/v0.145.2...v0.145.3) (2018-11-27)

**Note:** Version bump only for package @ehealth/admin





<a name="0.145.2"></a>
## [0.145.2](https://github.com/edenlabllc/ehealth.web/compare/v0.145.1...v0.145.2) (2018-11-26)


### Bug Fixes

* **admin:** fix position on Error component ([a7b3a15](https://github.com/edenlabllc/ehealth.web/commit/a7b3a15))





<a name="0.145.1"></a>
## [0.145.1](https://github.com/edenlabllc/ehealth.web/compare/v0.145.0...v0.145.1) (2018-11-26)


### Bug Fixes

* **admin:** add Ability check for the Persons link ([#538](https://github.com/edenlabllc/ehealth.web/issues/538)) ([3f31bea](https://github.com/edenlabllc/ehealth.web/commit/3f31bea))





<a name="0.145.0"></a>
# [0.145.0](https://github.com/edenlabllc/ehealth.web/compare/v0.144.2...v0.145.0) (2018-11-26)


### Features

* **admin:** add text message for error ([89e4ee2](https://github.com/edenlabllc/ehealth.web/commit/89e4ee2))





<a name="0.144.2"></a>
## [0.144.2](https://github.com/edenlabllc/ehealth.web/compare/v0.144.1...v0.144.2) (2018-11-26)


### Bug Fixes

* **admin:** add Error handling to admin ([681bac8](https://github.com/edenlabllc/ehealth.web/commit/681bac8))





<a name="0.144.1"></a>
## [0.144.1](https://github.com/edenlabllc/ehealth.web/compare/v0.144.0...v0.144.1) (2018-11-23)


### Bug Fixes

* **admin:** fix view License on LegalEntities details ([1ea7d00](https://github.com/edenlabllc/ehealth.web/commit/1ea7d00))





<a name="0.144.0"></a>
# [0.144.0](https://github.com/edenlabllc/ehealth.web/compare/v0.143.3...v0.144.0) (2018-11-23)

**Note:** Version bump only for package @ehealth/admin





<a name="0.143.3"></a>
## [0.143.3](https://github.com/edenlabllc/ehealth.web/compare/v0.143.2...v0.143.3) (2018-11-23)


### Bug Fixes

* **admin:** update reset search button on Search pages ([e2933b0](https://github.com/edenlabllc/ehealth.web/commit/e2933b0))





<a name="0.143.2"></a>
## [0.143.2](https://github.com/edenlabllc/ehealth.web/compare/v0.143.1...v0.143.2) (2018-11-23)


### Bug Fixes

* **admin:** update search by edrpou according to the new scheme on Contracts List page ([ff0ec2a](https://github.com/edenlabllc/ehealth.web/commit/ff0ec2a))





<a name="0.143.1"></a>
## [0.143.1](https://github.com/edenlabllc/ehealth.web/compare/v0.143.0...v0.143.1) (2018-11-22)

**Note:** Version bump only for package @ehealth/admin





<a name="0.143.0"></a>
# [0.143.0](https://github.com/edenlabllc/ehealth.web/compare/v0.142.1...v0.143.0) (2018-11-22)


### Features

* **admin:** format and add workingHours to the Divisions table on CR Details ([e823c79](https://github.com/edenlabllc/ehealth.web/commit/e823c79))





<a name="0.142.1"></a>
## [0.142.1](https://github.com/edenlabllc/ehealth.web/compare/v0.142.0...v0.142.1) (2018-11-22)


### Bug Fixes

* **admin:** update translations and mapping into the Licenses tab on LE details ([#526](https://github.com/edenlabllc/ehealth.web/issues/526)) ([7beafc1](https://github.com/edenlabllc/ehealth.web/commit/7beafc1))





<a name="0.142.0"></a>
# [0.142.0](https://github.com/edenlabllc/ehealth.web/compare/v0.141.1...v0.142.0) (2018-11-22)


### Features

* **admin:** add default initial values in form on update CR ([94a157a](https://github.com/edenlabllc/ehealth.web/commit/94a157a))





<a name="0.141.1"></a>
## [0.141.1](https://github.com/edenlabllc/ehealth.web/compare/v0.141.0...v0.141.1) (2018-11-22)


### Bug Fixes

* **admin:** change search param from id to databaseId on Legal Entity List page ([#525](https://github.com/edenlabllc/ehealth.web/issues/525)) ([651117f](https://github.com/edenlabllc/ehealth.web/commit/651117f))





<a name="0.141.0"></a>
# [0.141.0](https://github.com/edenlabllc/ehealth.web/compare/v0.140.4...v0.141.0) (2018-11-22)


### Features

* **admin:** add Dictionary Details page ([df8fb5c](https://github.com/edenlabllc/ehealth.web/commit/df8fb5c))
* **admin:** add ReadOnly label handling, add Remove Value handler, change type of state value from string to object for adding new Value ([95f3efc](https://github.com/edenlabllc/ehealth.web/commit/95f3efc))





<a name="0.140.4"></a>
## [0.140.4](https://github.com/edenlabllc/ehealth.web/compare/v0.140.3...v0.140.4) (2018-11-22)


### Bug Fixes

* **admin:** remove dropdown list opening in Select after pressing the enter button ([8dd4ebb](https://github.com/edenlabllc/ehealth.web/commit/8dd4ebb))





<a name="0.140.3"></a>
## [0.140.3](https://github.com/edenlabllc/ehealth.web/compare/v0.140.2...v0.140.3) (2018-11-21)


### Bug Fixes

* **admin:** hide expiryDate if it is null ([#522](https://github.com/edenlabllc/ehealth.web/issues/522)) ([e17cf91](https://github.com/edenlabllc/ehealth.web/commit/e17cf91))





<a name="0.140.2"></a>
## [0.140.2](https://github.com/edenlabllc/ehealth.web/compare/v0.140.1...v0.140.2) (2018-11-21)


### Bug Fixes

* **admin:** add Ability check for the NavSections ([#521](https://github.com/edenlabllc/ehealth.web/issues/521)) ([0c7ffbe](https://github.com/edenlabllc/ehealth.web/commit/0c7ffbe))





<a name="0.140.1"></a>
## [0.140.1](https://github.com/edenlabllc/ehealth.web/compare/v0.140.0...v0.140.1) (2018-11-21)


### Bug Fixes

* **admin:** change Select type on CR Update page, add max-height to the Dropdown List ([#520](https://github.com/edenlabllc/ehealth.web/issues/520)) ([bbea4e5](https://github.com/edenlabllc/ehealth.web/commit/bbea4e5))





<a name="0.140.0"></a>
# [0.140.0](https://github.com/edenlabllc/ehealth.web/compare/v0.139.0...v0.140.0) (2018-11-21)


### Features

* **admin:** add text to Home page and delete redirect to LE ([#519](https://github.com/edenlabllc/ehealth.web/issues/519)) ([46db33e](https://github.com/edenlabllc/ehealth.web/commit/46db33e))





<a name="0.139.0"></a>
# [0.139.0](https://github.com/edenlabllc/ehealth.web/compare/v0.138.0...v0.139.0) (2018-11-21)


### Features

* **admin:** add flag for the dictionaries ([f9889fb](https://github.com/edenlabllc/ehealth.web/commit/f9889fb))





<a name="0.138.0"></a>
# [0.138.0](https://github.com/edenlabllc/ehealth.web/compare/v0.137.0...v0.138.0) (2018-11-20)


### Features

* **admin:** add link to le on contracts and contractRequests details ([#514](https://github.com/edenlabllc/ehealth.web/issues/514)) ([ae9f291](https://github.com/edenlabllc/ehealth.web/commit/ae9f291))





<a name="0.137.0"></a>
# [0.137.0](https://github.com/edenlabllc/ehealth.web/compare/v0.136.0...v0.137.0) (2018-11-20)

**Note:** Version bump only for package @ehealth/admin





<a name="0.136.0"></a>
# [0.136.0](https://github.com/edenlabllc/ehealth.web/compare/v0.135.3...v0.136.0) (2018-11-19)


### Features

* **admin:** add Dictionaries Search page ([d79e0b4](https://github.com/edenlabllc/ehealth.web/commit/d79e0b4))





<a name="0.135.3"></a>
## [0.135.3](https://github.com/edenlabllc/ehealth.web/compare/v0.135.2...v0.135.3) (2018-11-16)


### Bug Fixes

* **admin:** fix link to previousRequest on ContractRequests details ([9fc403f](https://github.com/edenlabllc/ehealth.web/commit/9fc403f))





<a name="0.135.2"></a>
## [0.135.2](https://github.com/edenlabllc/ehealth.web/compare/v0.135.1...v0.135.2) (2018-11-15)


### Bug Fixes

* **admin:** fix fetch policy in query list ([9fc0736](https://github.com/edenlabllc/ehealth.web/commit/9fc0736))





<a name="0.135.1"></a>
## [0.135.1](https://github.com/edenlabllc/ehealth.web/compare/v0.135.0...v0.135.1) (2018-11-15)


### Bug Fixes

* **admin:** fix view Contract and ContractRequest details view ([be1b357](https://github.com/edenlabllc/ehealth.web/commit/be1b357))





<a name="0.135.0"></a>
# [0.135.0](https://github.com/edenlabllc/ehealth.web/compare/v0.134.1...v0.135.0) (2018-11-15)


### Features

* **admin:** add features flag for the legacy links ([ce9d5df](https://github.com/edenlabllc/ehealth.web/commit/ce9d5df))





<a name="0.134.0"></a>
# [0.134.0](https://github.com/edenlabllc/ehealth.web/compare/v0.133.4...v0.134.0) (2018-11-15)


### Features

* **admin:** add new env variables to the Admin and Admin Legacy ([921d9e1](https://github.com/edenlabllc/ehealth.web/commit/921d9e1))
* **admin:** link Admin and Admin Legacy with each other ([1bd2652](https://github.com/edenlabllc/ehealth.web/commit/1bd2652))





<a name="0.133.4"></a>
## [0.133.4](https://github.com/edenlabllc/ehealth.web/compare/v0.133.3...v0.133.4) (2018-11-14)


### Bug Fixes

* **admin:** fix mutation verify and deactivate Legal entities ([2c659f2](https://github.com/edenlabllc/ehealth.web/commit/2c659f2))
* **admin:** rename query to EmployeesQuery ([87e0619](https://github.com/edenlabllc/ehealth.web/commit/87e0619))





<a name="0.133.3"></a>
## [0.133.3](https://github.com/edenlabllc/ehealth.web/compare/v0.133.2...v0.133.3) (2018-11-13)

**Note:** Version bump only for package @ehealth/admin





<a name="0.133.2"></a>
## [0.133.2](https://github.com/edenlabllc/ehealth.web/compare/v0.133.1...v0.133.2) (2018-11-13)


### Bug Fixes

* **components:** change logic onBlur in open calendar ([615abe5](https://github.com/edenlabllc/ehealth.web/commit/615abe5))





<a name="0.133.1"></a>
## [0.133.1](https://github.com/edenlabllc/ehealth.web/compare/v0.133.0...v0.133.1) (2018-11-13)

**Note:** Version bump only for package @ehealth/admin





<a name="0.133.0"></a>
# [0.133.0](https://github.com/edenlabllc/ehealth.web/compare/v0.132.6...v0.133.0) (2018-11-13)

**Note:** Version bump only for package @ehealth/admin





<a name="0.132.6"></a>
## [0.132.6](https://github.com/edenlabllc/ehealth.web/compare/v0.132.5...v0.132.6) (2018-11-12)

**Note:** Version bump only for package @ehealth/admin





<a name="0.132.5"></a>
## [0.132.5](https://github.com/edenlabllc/ehealth.web/compare/v0.132.4...v0.132.5) (2018-11-12)

**Note:** Version bump only for package @ehealth/admin





<a name="0.132.4"></a>
## [0.132.4](https://github.com/edenlabllc/ehealth.web/compare/v0.132.3...v0.132.4) (2018-11-12)


### Bug Fixes

* **admin:** add red color error in SelectField ([0898cb8](https://github.com/edenlabllc/ehealth.web/commit/0898cb8))
* **admin:** add validation select inputs on update CR ([f8c1e54](https://github.com/edenlabllc/ehealth.web/commit/f8c1e54))





<a name="0.132.3"></a>
## [0.132.3](https://github.com/edenlabllc/ehealth.web/compare/v0.132.2...v0.132.3) (2018-11-12)


### Bug Fixes

* **admin:** add link to contract request from contract ([71e2652](https://github.com/edenlabllc/ehealth.web/commit/71e2652))





<a name="0.132.2"></a>
## [0.132.2](https://github.com/edenlabllc/ehealth.web/compare/v0.132.1...v0.132.2) (2018-11-12)


### Bug Fixes

* **admin:** add whiteSpaceNoWrap to the Table component and Tables on Contract and ContractRequests pages ([#475](https://github.com/edenlabllc/ehealth.web/issues/475)) ([eb7c98a](https://github.com/edenlabllc/ehealth.web/commit/eb7c98a))





<a name="0.132.1"></a>
## [0.132.1](https://github.com/edenlabllc/ehealth.web/compare/v0.132.0...v0.132.1) (2018-11-12)


### Bug Fixes

* **admin:** add refetchQueries in sign CR ([892525c](https://github.com/edenlabllc/ehealth.web/commit/892525c))





<a name="0.132.0"></a>
# [0.132.0](https://github.com/edenlabllc/ehealth.web/compare/v0.131.4...v0.132.0) (2018-11-12)


### Features

* **admin:** add isSuspended filter to the Contract Search ([#473](https://github.com/edenlabllc/ehealth.web/issues/473)) ([5d0572d](https://github.com/edenlabllc/ehealth.web/commit/5d0572d))





<a name="0.131.4"></a>
## [0.131.4](https://github.com/edenlabllc/ehealth.web/compare/v0.131.3...v0.131.4) (2018-11-12)


### Bug Fixes

* **admin:** add dababaseId as search arg, rename contractRequestId in Contract details ([f86d662](https://github.com/edenlabllc/ehealth.web/commit/f86d662))
* **admin:** change query graphql in ContractRequest ([87193aa](https://github.com/edenlabllc/ehealth.web/commit/87193aa))
* **admin:** change view button mutation in Switch in Contract Requests ([2ce8095](https://github.com/edenlabllc/ehealth.web/commit/2ce8095))
* **admin:** fix mutation approve ContractRequests ([1404cc2](https://github.com/edenlabllc/ehealth.web/commit/1404cc2))
* **admin:** fix mutation decline ContractRequests ([8582a52](https://github.com/edenlabllc/ehealth.web/commit/8582a52))
* **admin:** fix mutation sign ContractRequests ([d854c89](https://github.com/edenlabllc/ehealth.web/commit/d854c89))





<a name="0.131.3"></a>
## [0.131.3](https://github.com/edenlabllc/ehealth.web/compare/v0.131.2...v0.131.3) (2018-11-12)

**Note:** Version bump only for package @ehealth/admin





<a name="0.131.2"></a>
## [0.131.2](https://github.com/edenlabllc/ehealth.web/compare/v0.131.1...v0.131.2) (2018-11-11)


### Bug Fixes

* **admin:** add first arg ([83cde9b](https://github.com/edenlabllc/ehealth.web/commit/83cde9b))





<a name="0.131.1"></a>
## [0.131.1](https://github.com/edenlabllc/ehealth.web/compare/v0.131.0...v0.131.1) (2018-11-09)


### Bug Fixes

* **admin:** fix contracts update, change genitive case of contract requests ([c4ef3b2](https://github.com/edenlabllc/ehealth.web/commit/c4ef3b2))





<a name="0.131.0"></a>
# [0.131.0](https://github.com/edenlabllc/ehealth.web/compare/v0.130.0...v0.131.0) (2018-11-09)


### Features

* **admin:** add assignee select and submit mutation to the ContractRequestDetails ([#468](https://github.com/edenlabllc/ehealth.web/issues/468)) ([bde4591](https://github.com/edenlabllc/ehealth.web/commit/bde4591))





<a name="0.130.0"></a>
# [0.130.0](https://github.com/edenlabllc/ehealth.web/compare/v0.129.0...v0.130.0) (2018-11-09)


### Features

* **admin:** add search by assigneeName to the ContractRequestSearch form ([9de7185](https://github.com/edenlabllc/ehealth.web/commit/9de7185))





<a name="0.129.0"></a>
# [0.129.0](https://github.com/edenlabllc/ehealth.web/compare/v0.128.0...v0.129.0) (2018-11-09)


### Bug Fixes

* **admin:** remove unused import and components ([1429592](https://github.com/edenlabllc/ehealth.web/commit/1429592))
* **admin:** rename nav item ([5612957](https://github.com/edenlabllc/ehealth.web/commit/5612957))


### Features

* **admin:** add contract details page ([be6132f](https://github.com/edenlabllc/ehealth.web/commit/be6132f))





<a name="0.128.0"></a>
# [0.128.0](https://github.com/edenlabllc/ehealth.web/compare/v0.127.1...v0.128.0) (2018-11-09)


### Features

* **admin:** add Contract Details and Contracts List features ([#466](https://github.com/edenlabllc/ehealth.web/issues/466)) ([d09d7c6](https://github.com/edenlabllc/ehealth.web/commit/d09d7c6))





<a name="0.127.1"></a>
## [0.127.1](https://github.com/edenlabllc/ehealth.web/compare/v0.127.0...v0.127.1) (2018-11-09)

**Note:** Version bump only for package @ehealth/admin





<a name="0.127.0"></a>
# [0.127.0](https://github.com/edenlabllc/ehealth.web/compare/v0.126.3...v0.127.0) (2018-11-09)


### Features

* **admin:** add choose nhsSiner to update CR ([850ea37](https://github.com/edenlabllc/ehealth.web/commit/850ea37))





<a name="0.126.3"></a>
## [0.126.3](https://github.com/edenlabllc/ehealth.web/compare/v0.126.2...v0.126.3) (2018-11-09)


### Bug Fixes

* **admin:** change style in Form and localization name of contract on Contract page ([77c291d](https://github.com/edenlabllc/ehealth.web/commit/77c291d))





<a name="0.126.2"></a>
## [0.126.2](https://github.com/edenlabllc/ehealth.web/compare/v0.126.1...v0.126.2) (2018-11-08)


### Bug Fixes

* **admin:** add check of REACT_APP_FEATURES env variable ([5c57761](https://github.com/edenlabllc/ehealth.web/commit/5c57761))





<a name="0.126.1"></a>
## [0.126.1](https://github.com/edenlabllc/ehealth.web/compare/v0.126.0...v0.126.1) (2018-11-08)


### Bug Fixes

* **admin:** add env.test, move variable to env.dev ([37ba3ef](https://github.com/edenlabllc/ehealth.web/commit/37ba3ef))





<a name="0.126.0"></a>
# [0.126.0](https://github.com/edenlabllc/ehealth.web/compare/v0.125.0...v0.126.0) (2018-11-08)


### Bug Fixes

* **admin:** fix pagination on Contracts and Legalentities pages ([e3633ec](https://github.com/edenlabllc/ehealth.web/commit/e3633ec))


### Features

* **admin:** add page search contracts ([0f1e1df](https://github.com/edenlabllc/ehealth.web/commit/0f1e1df))





<a name="0.125.0"></a>
# [0.125.0](https://github.com/edenlabllc/ehealth.web/compare/v0.124.0...v0.125.0) (2018-11-08)


### Bug Fixes

* **admin:** add zIndex value to the ModalSelect ([6ab73c4](https://github.com/edenlabllc/ehealth.web/commit/6ab73c4))


### Features

* **admin:** add ContractRequestDetails tabs and subpages ([4f25cbb](https://github.com/edenlabllc/ehealth.web/commit/4f25cbb))
* **admin:** add headless prop to the Table, update Table styles for creating inner tables without header ([ebd1c9a](https://github.com/edenlabllc/ehealth.web/commit/ebd1c9a))
* **admin:** add Icon customization and errors hiding ability to the Select Component ([faab29a](https://github.com/edenlabllc/ehealth.web/commit/faab29a))
* **admin:** add new fields to the ContractRequestQuery ([58fe503](https://github.com/edenlabllc/ehealth.web/commit/58fe503))





<a name="0.124.0"></a>
# [0.124.0](https://github.com/edenlabllc/ehealth.web/compare/v0.123.2...v0.124.0) (2018-11-08)


### Bug Fixes

* **admin:** add empty line ([398c427](https://github.com/edenlabllc/ehealth.web/commit/398c427))
* **admin:** move env var to .env ([9055ad1](https://github.com/edenlabllc/ehealth.web/commit/9055ad1))
* **admin:** use fromPairs ([095d073](https://github.com/edenlabllc/ehealth.web/commit/095d073))


### Features

* **admin:** add feature flags ([f418419](https://github.com/edenlabllc/ehealth.web/commit/f418419))





<a name="0.123.1"></a>
## [0.123.1](https://github.com/edenlabllc/ehealth.web/compare/v0.123.0...v0.123.1) (2018-11-08)


### Bug Fixes

* **admin:** return the removeItem method to the reset table button ([8d57717](https://github.com/edenlabllc/ehealth.web/commit/8d57717))





<a name="0.123.0"></a>
# [0.123.0](https://github.com/edenlabllc/ehealth.web/compare/v0.122.1...v0.123.0) (2018-11-07)


### Features

* **admin:** add `input DivisionFilter` to `Division` tab `LEGAL_ENTITY Details` page ([011651b](https://github.com/edenlabllc/ehealth.web/commit/011651b))
* **admin:** add features for `ContractRequest List` and `ContractRequest Details` ([b7f1fee](https://github.com/edenlabllc/ehealth.web/commit/b7f1fee))





<a name="0.122.0"></a>
# [0.122.0](https://github.com/edenlabllc/ehealth.web/compare/v0.121.1...v0.122.0) (2018-11-07)


### Bug Fixes

* **admin:** update date ranges, check contractRequest for empty value, add first param ([201a7ec](https://github.com/edenlabllc/ehealth.web/commit/201a7ec))


### Features

* **admin:** add pagination to the Contract Requests Search ([a3e7972](https://github.com/edenlabllc/ehealth.web/commit/a3e7972))





<a name="0.121.1"></a>
## [0.121.1](https://github.com/edenlabllc/ehealth.web/compare/v0.121.0...v0.121.1) (2018-11-07)


### Bug Fixes

* update react-apollo, fix DataProvider error handling ([d9016a9](https://github.com/edenlabllc/ehealth.web/commit/d9016a9))





<a name="0.121.0"></a>
# [0.121.0](https://github.com/edenlabllc/ehealth.web/compare/v0.120.1...v0.121.0) (2018-11-07)


### Features

* **admin:** add pageInfo to GraphQL query ([6fefecc](https://github.com/edenlabllc/ehealth.web/commit/6fefecc))
* **admin:** add Pagination component to admin ([8292629](https://github.com/edenlabllc/ehealth.web/commit/8292629))
* **admin:** create constants for pagination ([4d21725](https://github.com/edenlabllc/ehealth.web/commit/4d21725))
* **admin:** use Pagination on Search LegalEntities ([f25f33b](https://github.com/edenlabllc/ehealth.web/commit/f25f33b))





<a name="0.120.0"></a>
# [0.120.0](https://github.com/edenlabllc/ehealth.web/compare/v0.119.0...v0.120.0) (2018-11-05)

**Note:** Version bump only for package @ehealth/admin





<a name="0.119.0"></a>
# [0.119.0](https://github.com/edenlabllc/ehealth.web/compare/v0.118.0...v0.119.0) (2018-11-05)


### Features

* **admin:** add cell sizes saving for the Table component ([1899149](https://github.com/edenlabllc/ehealth.web/commit/1899149))





<a name="0.118.0"></a>
# [0.118.0](https://github.com/edenlabllc/ehealth.web/compare/v0.117.1...v0.118.0) (2018-11-02)


### Features

* **admin:** styled logout link ([2705760](https://github.com/edenlabllc/ehealth.web/commit/2705760))





<a name="0.117.0"></a>
# [0.117.0](https://github.com/edenlabllc/ehealth.web/compare/v0.116.0...v0.117.0) (2018-10-31)

**Note:** Version bump only for package @ehealth/admin





<a name="0.116.0"></a>
# [0.116.0](https://github.com/edenlabllc/ehealth.web/compare/v0.115.0...v0.116.0) (2018-10-31)


### Features

* **admin:** add link to parent LE for reorganized LE ([1bb8c19](https://github.com/edenlabllc/ehealth.web/commit/1bb8c19))





<a name="0.115.0"></a>
# [0.115.0](https://github.com/edenlabllc/ehealth.web/compare/v0.114.2...v0.115.0) (2018-10-31)

**Note:** Version bump only for package @ehealth/admin





<a name="0.114.0"></a>
# [0.114.0](https://github.com/edenlabllc/ehealth.web/compare/v0.113.0...v0.114.0) (2018-10-30)


### Features

* **admin:** add logout link ([fae1637](https://github.com/edenlabllc/ehealth.web/commit/fae1637))





<a name="0.113.0"></a>
# [0.113.0](https://github.com/edenlabllc/ehealth.web/compare/v0.112.0...v0.113.0) (2018-10-30)

**Note:** Version bump only for package @ehealth/admin





<a name="0.112.0"></a>
# [0.112.0](https://github.com/edenlabllc/ehealth.web/compare/v0.111.0...v0.112.0) (2018-10-30)


### Bug Fixes

* **admin:** fix buttons behavior after page resize ([7a43ac6](https://github.com/edenlabllc/ehealth.web/commit/7a43ac6))





<a name="0.111.1"></a>
## [0.111.1](https://github.com/edenlabllc/ehealth.web/compare/v0.111.0...v0.111.1) (2018-10-30)


### Bug Fixes

* **admin:** fix buttons behavior after page resize ([7a43ac6](https://github.com/edenlabllc/ehealth.web/commit/7a43ac6))





<a name="0.111.0"></a>
# [0.111.0](https://github.com/edenlabllc/ehealth.web/compare/v0.110.10...v0.111.0) (2018-10-29)


### Bug Fixes

* **admin:** change filter type according to schema ([5bd92a8](https://github.com/edenlabllc/ehealth.web/commit/5bd92a8))





<a name="0.110.10"></a>
## [0.110.10](https://github.com/edenlabllc/ehealth.web/compare/v0.110.9...v0.110.10) (2018-10-29)


### Bug Fixes

* **admin:** add validation in search legalentity ([72d722f](https://github.com/edenlabllc/ehealth.web/commit/72d722f))





<a name="0.110.9"></a>
## [0.110.9](https://github.com/edenlabllc/ehealth.web/compare/v0.110.8...v0.110.9) (2018-10-27)


### Bug Fixes

* **admin:** rename query and fix search on divisions tab ([09a5386](https://github.com/edenlabllc/ehealth.web/commit/09a5386))





<a name="0.110.8"></a>
## [0.110.8](https://github.com/edenlabllc/ehealth.web/compare/v0.110.7...v0.110.8) (2018-10-25)


### Bug Fixes

* **admin:** hide execution time for LE Job with status Pending ([35feac3](https://github.com/edenlabllc/ehealth.web/commit/35feac3))





<a name="0.110.6"></a>
## [0.110.6](https://github.com/edenlabllc/ehealth.web/compare/v0.110.5...v0.110.6) (2018-10-25)


### Bug Fixes

* **admin:** hide LE Table if filter is empty ([286724d](https://github.com/edenlabllc/ehealth.web/commit/286724d))





<a name="0.110.5"></a>
## [0.110.5](https://github.com/edenlabllc/ehealth.web/compare/v0.110.4...v0.110.5) (2018-10-25)


### Bug Fixes

* **admin:** hide Owner Tab if owner is null in LE Details, add check for owner in Table on Add Related LE page ([7431f13](https://github.com/edenlabllc/ehealth.web/commit/7431f13))





<a name="0.110.4"></a>
## [0.110.4](https://github.com/edenlabllc/ehealth.web/compare/v0.110.3...v0.110.4) (2018-10-25)


### Bug Fixes

* **admin:** add dash to the execution time, if result is negative ([9257cb0](https://github.com/edenlabllc/ehealth.web/commit/9257cb0))
* **admin:** remove autosubmit from edrpou field, add search and reset buttons, add icon for nhs unverified ([b160e13](https://github.com/edenlabllc/ehealth.web/commit/b160e13))
* **admin:** update position for verified icon in LE Add table ([70b6242](https://github.com/edenlabllc/ehealth.web/commit/70b6242))
* **admin:** update stroke param for Unverified icon, add icon for not mountain region and to the first tab on LE details page ([067bbb1](https://github.com/edenlabllc/ehealth.web/commit/067bbb1))





<a name="0.110.3"></a>
## [0.110.3](https://github.com/edenlabllc/ehealth.web/compare/v0.110.2...v0.110.3) (2018-10-24)


### Bug Fixes

* **admin:** add noThrow to redirect from home page ([a4cebd6](https://github.com/edenlabllc/ehealth.web/commit/a4cebd6))





<a name="0.110.2"></a>
## [0.110.2](https://github.com/edenlabllc/ehealth.web/compare/v0.110.1...v0.110.2) (2018-10-24)


### Bug Fixes

* **admin:** change LE type to NHS, add owner to LE query ([f8e99f8](https://github.com/edenlabllc/ehealth.web/commit/f8e99f8))





<a name="0.110.0"></a>
# [0.110.0](https://github.com/edenlabllc/ehealth.web/compare/v0.109.0...v0.110.0) (2018-10-24)


### Features

* **admin:** add search by type ([33f52f8](https://github.com/edenlabllc/ehealth.web/commit/33f52f8))





<a name="0.109.0"></a>
# [0.109.0](https://github.com/edenlabllc/ehealth.web/compare/v0.108.4...v0.109.0) (2018-10-24)

**Note:** Version bump only for package @ehealth/admin





<a name="0.108.4"></a>
## [0.108.4](https://github.com/edenlabllc/ehealth.web/compare/v0.108.3...v0.108.4) (2018-10-24)


### Bug Fixes

* **admin:** add "first" variable to LegalEntityQuery ([2a00849](https://github.com/edenlabllc/ehealth.web/commit/2a00849))





<a name="0.108.3"></a>
## [0.108.3](https://github.com/edenlabllc/ehealth.web/compare/v0.108.2...v0.108.3) (2018-10-24)


### Bug Fixes

* **admin:** update legal entity details ([0979e68](https://github.com/edenlabllc/ehealth.web/commit/0979e68))





<a name="0.108.2"></a>
## [0.108.2](https://github.com/edenlabllc/ehealth.web/compare/v0.108.1...v0.108.2) (2018-10-23)


### Bug Fixes

* **admin:** fix mixed-up fields ([91aa3c4](https://github.com/edenlabllc/ehealth.web/commit/91aa3c4))





<a name="0.108.1"></a>
## [0.108.1](https://github.com/edenlabllc/ehealth.web/compare/v0.108.0...v0.108.1) (2018-10-23)


### Bug Fixes

* **admin:** add redirect from home page to legal-entities ([891c12e](https://github.com/edenlabllc/ehealth.web/commit/891c12e))





<a name="0.108.0"></a>
# [0.108.0](https://github.com/edenlabllc/ehealth.web/compare/v0.107.1...v0.108.0) (2018-10-23)


### Bug Fixes

* **admin:** fix 401 network error handling ([86f2f25](https://github.com/edenlabllc/ehealth.web/commit/86f2f25))
* **admin:** hide settlement search ([f6fdaec](https://github.com/edenlabllc/ehealth.web/commit/f6fdaec))
* **admin:** uncomment divisions in LegalEntityDetails ([cc14d47](https://github.com/edenlabllc/ehealth.web/commit/cc14d47))
* **admin:** uncomment query fields ([90b8aa9](https://github.com/edenlabllc/ehealth.web/commit/90b8aa9))





<a name="0.107.1"></a>
## [0.107.1](https://github.com/edenlabllc/ehealth.web/compare/v0.107.0...v0.107.1) (2018-10-23)


### Bug Fixes

* **admin:** fix related legal entities tab ([c45d5fc](https://github.com/edenlabllc/ehealth.web/commit/c45d5fc))





<a name="0.107.0"></a>
# [0.107.0](https://github.com/edenlabllc/ehealth.web/compare/v0.106.3...v0.107.0) (2018-10-23)


### Features

* **admin:** add contract request statuses in helpers and theme ([29f1e39](https://github.com/edenlabllc/ehealth.web/commit/29f1e39))
* **admin:** add Decline ContractRequest ([bc3c889](https://github.com/edenlabllc/ehealth.web/commit/bc3c889))
* **admin:** add Line to components ([eb85fe6](https://github.com/edenlabllc/ehealth.web/commit/eb85fe6))
* **admin:** add part of Details for ContractRequest ([c1e14c0](https://github.com/edenlabllc/ehealth.web/commit/c1e14c0))
* **admin:** add print-iframe pkg to package.json ([76abf11](https://github.com/edenlabllc/ehealth.web/commit/76abf11))
* **admin:** add Sign ContractRequest ([0bca5f1](https://github.com/edenlabllc/ehealth.web/commit/0bca5f1))
* **admin:** Approve and Update ContractRequest ([347afd9](https://github.com/edenlabllc/ehealth.web/commit/347afd9))





<a name="0.106.3"></a>
## [0.106.3](https://github.com/edenlabllc/ehealth.web/compare/v0.106.2...v0.106.3) (2018-10-23)


### Bug Fixes

* **admin:** add nav scopes ([83f20fd](https://github.com/edenlabllc/ehealth.web/commit/83f20fd))





<a name="0.106.2"></a>
## [0.106.2](https://github.com/edenlabllc/ehealth.web/compare/v0.106.1...v0.106.2) (2018-10-23)


### Bug Fixes

* **admin:** fix horizontal scroll in tables ([758375a](https://github.com/edenlabllc/ehealth.web/commit/758375a))





<a name="0.106.1"></a>
## [0.106.1](https://github.com/edenlabllc/ehealth.web/compare/v0.106.0...v0.106.1) (2018-10-23)


### Bug Fixes

* **admin:** fix admin 401 error handling ([d0aed15](https://github.com/edenlabllc/ehealth.web/commit/d0aed15))





<a name="0.106.0"></a>
# [0.106.0](https://github.com/edenlabllc/ehealth.web/compare/v0.105.0...v0.106.0) (2018-10-22)


### Bug Fixes

* **admin:** add executionTime field ([2f1ec0e](https://github.com/edenlabllc/ehealth.web/commit/2f1ec0e))
* **admin:** remove sort by endedAt field ([6b602d9](https://github.com/edenlabllc/ehealth.web/commit/6b602d9))
* **admin:** rename contracts ([545d6f2](https://github.com/edenlabllc/ehealth.web/commit/545d6f2))


### Features

* **admin:** add LegalEntitiesMergeJobs search page ([a8fc355](https://github.com/edenlabllc/ehealth.web/commit/a8fc355))
* **admin:** add LegalEntitiesMergeJobsQuery ([7442f71](https://github.com/edenlabllc/ehealth.web/commit/7442f71))





<a name="0.105.0"></a>
# [0.105.0](https://github.com/edenlabllc/ehealth.web/compare/v0.104.0...v0.105.0) (2018-10-19)


### Bug Fixes

* **admin:** change view table in legalEntities search page ([e3702e0](https://github.com/edenlabllc/ehealth.web/commit/e3702e0))





<a name="0.104.0"></a>
# [0.104.0](https://github.com/edenlabllc/ehealth.web/compare/v0.103.3...v0.104.0) (2018-10-19)


### Features

* **admin:** add ContractRequests Search page ([ca62095](https://github.com/edenlabllc/ehealth.web/commit/ca62095))
* **admin:** add graphql query for the Contract Request list ([c10f1b0](https://github.com/edenlabllc/ehealth.web/commit/c10f1b0))
* **admin:** add route and navigation link to the Contract Request list ([8f4631b](https://github.com/edenlabllc/ehealth.web/commit/8f4631b))





<a name="0.103.3"></a>
## [0.103.3](https://github.com/edenlabllc/ehealth.web/compare/v0.103.2...v0.103.3) (2018-10-18)


### Bug Fixes

* **admin:** rename fields in signContent ([1ac43eb](https://github.com/edenlabllc/ehealth.web/commit/1ac43eb))





<a name="0.103.2"></a>
## [0.103.2](https://github.com/edenlabllc/ehealth.web/compare/v0.103.1...v0.103.2) (2018-10-18)

**Note:** Version bump only for package @ehealth/admin





<a name="0.103.1"></a>
## [0.103.1](https://github.com/edenlabllc/ehealth.web/compare/v0.103.0...v0.103.1) (2018-10-18)

**Note:** Version bump only for package @ehealth/admin





<a name="0.103.0"></a>
# [0.103.0](https://github.com/edenlabllc/ehealth.web/compare/v0.102.10...v0.103.0) (2018-10-17)


### Bug Fixes

* **admin:** add param to SearchLegalEntitiesQuery ([e288b72](https://github.com/edenlabllc/ehealth.web/commit/e288b72))





<a name="0.102.9"></a>
## [0.102.9](https://github.com/edenlabllc/ehealth.web/compare/v0.102.8...v0.102.9) (2018-10-16)

**Note:** Version bump only for package @ehealth/admin





<a name="0.102.4"></a>
## [0.102.4](https://github.com/edenlabllc/ehealth.web/compare/v0.102.3...v0.102.4) (2018-10-11)


### Bug Fixes

* **admin:** remove unnecessary brackets ([d691a0b](https://github.com/edenlabllc/ehealth.web/commit/d691a0b))





<a name="0.102.3"></a>
## [0.102.3](https://github.com/edenlabllc/ehealth.web/compare/v0.102.2...v0.102.3) (2018-10-11)


### Bug Fixes

* **admin:** change RangeDateField to return ISO date, fix RangeDateField appearance and validation ([76732cb](https://github.com/edenlabllc/ehealth.web/commit/76732cb))





<a name="0.102.1"></a>
## [0.102.1](https://github.com/edenlabllc/ehealth.web/compare/v0.102.0...v0.102.1) (2018-10-10)


### Bug Fixes

* **admin:** fix mergeLegalEntities steps flow ([1faf054](https://github.com/edenlabllc/ehealth.web/commit/1faf054))





<a name="0.102.0"></a>
# [0.102.0](https://github.com/edenlabllc/ehealth.web/compare/v0.101.7...v0.102.0) (2018-10-09)


### Features

* **admin:** add switch sorting params in TableHeader component ([9dc97a6](https://github.com/edenlabllc/ehealth.web/commit/9dc97a6))





<a name="0.101.7"></a>
## [0.101.7](https://github.com/edenlabllc/ehealth.web/compare/v0.101.6...v0.101.7) (2018-10-09)

**Note:** Version bump only for package @ehealth/admin





<a name="0.101.6"></a>
## [0.101.6](https://github.com/edenlabllc/ehealth.web/compare/v0.101.5...v0.101.6) (2018-10-09)


### Bug Fixes

* **admin:** fix paddings, sorting in table and steps ([893b783](https://github.com/edenlabllc/ehealth.web/commit/893b783))





<a name="0.101.5"></a>
## [0.101.5](https://github.com/edenlabllc/ehealth.web/compare/v0.101.4...v0.101.5) (2018-10-09)

**Note:** Version bump only for package @ehealth/admin





<a name="0.101.4"></a>
## [0.101.4](https://github.com/edenlabllc/ehealth.web/compare/v0.101.3...v0.101.4) (2018-10-09)


### Bug Fixes

* **admin:** add to table on legalEntities list column insertedAt ([997c846](https://github.com/edenlabllc/ehealth.web/commit/997c846))
* **admin:** change flow deactive, verify legalEntities ([a259a38](https://github.com/edenlabllc/ehealth.web/commit/a259a38))





<a name="0.101.3"></a>
## [0.101.3](https://github.com/edenlabllc/ehealth.web/compare/v0.101.2...v0.101.3) (2018-10-08)


### Bug Fixes

* **admin:** fix legalEntities page according to features ([3db6a54](https://github.com/edenlabllc/ehealth.web/commit/3db6a54))





<a name="0.101.2"></a>
## [0.101.2](https://github.com/edenlabllc/ehealth.web/compare/v0.101.1...v0.101.2) (2018-10-08)


### Bug Fixes

* **admin:** revert bold in Badge component ([fcb6404](https://github.com/edenlabllc/ehealth.web/commit/fcb6404))





<a name="0.101.1"></a>
## [0.101.1](https://github.com/edenlabllc/ehealth.web/compare/v0.101.0...v0.101.1) (2018-10-08)

**Note:** Version bump only for package @ehealth/admin





<a name="0.101.0"></a>
# [0.101.0](https://github.com/edenlabllc/ehealth.web/compare/v0.100.4...v0.101.0) (2018-10-06)

**Note:** Version bump only for package @ehealth/admin





<a name="0.100.4"></a>
## [0.100.4](https://github.com/edenlabllc/ehealth.web/compare/v0.100.3...v0.100.4) (2018-10-05)


### Bug Fixes

* **admin:** fix TableHeaderCellWithResize component sorting when resize cell ([432a158](https://github.com/edenlabllc/ehealth.web/commit/432a158))





<a name="0.100.3"></a>
## [0.100.3](https://github.com/edenlabllc/ehealth.web/compare/v0.100.2...v0.100.3) (2018-10-05)


### Bug Fixes

* **admin:** change ЄДР to ЄДДР ([f819caa](https://github.com/edenlabllc/ehealth.web/commit/f819caa))





<a name="0.100.2"></a>
## [0.100.2](https://github.com/edenlabllc/ehealth.web/compare/v0.100.1...v0.100.2) (2018-10-05)


### Bug Fixes

* **admin:** change declaration details general tab props ([25fef5c](https://github.com/edenlabllc/ehealth.web/commit/25fef5c))
* **admin:** changing style in buttons controll which use in documents tab ([f7be13c](https://github.com/edenlabllc/ehealth.web/commit/f7be13c))





<a name="0.100.1"></a>
## [0.100.1](https://github.com/edenlabllc/ehealth.web/compare/v0.100.0...v0.100.1) (2018-10-04)


### Bug Fixes

* **admin:** add unzr field in declaration ([c4fe4c6](https://github.com/edenlabllc/ehealth.web/commit/c4fe4c6))





<a name="0.100.0"></a>
# [0.100.0](https://github.com/edenlabllc/ehealth.web/compare/v0.99.1...v0.100.0) (2018-10-04)


### Features

* **admin:** add tab documents in declaration details ([3e08716](https://github.com/edenlabllc/ehealth.web/commit/3e08716))





<a name="0.99.1"></a>
## [0.99.1](https://github.com/edenlabllc/ehealth.web/compare/v0.99.0...v0.99.1) (2018-10-04)


### Bug Fixes

* **admin:** add type field in divisions ([621e147](https://github.com/edenlabllc/ehealth.web/commit/621e147))





<a name="0.99.0"></a>
# [0.99.0](https://github.com/edenlabllc/ehealth.web/compare/v0.98.1...v0.99.0) (2018-10-04)


### Features

* **admin:** add reset functionality for the table rows, add ResetIcon ([8ab63f0](https://github.com/edenlabllc/ehealth.web/commit/8ab63f0))





<a name="0.98.1"></a>
## [0.98.1](https://github.com/edenlabllc/ehealth.web/compare/v0.98.0...v0.98.1) (2018-10-03)


### Bug Fixes

* **admin:** create related legal entities ([a9239ca](https://github.com/edenlabllc/ehealth.web/commit/a9239ca))
* **admin:** fix typo in features ([7a42dcb](https://github.com/edenlabllc/ehealth.web/commit/7a42dcb))





<a name="0.98.0"></a>
# [0.98.0](https://github.com/edenlabllc/ehealth.web/compare/v0.97.1...v0.98.0) (2018-10-03)


### Features

* **admin:** add Divisions tab on LegalEntities details ([26445f0](https://github.com/edenlabllc/ehealth.web/commit/26445f0))





<a name="0.97.1"></a>
## [0.97.1](https://github.com/edenlabllc/ehealth.web/compare/v0.97.0...v0.97.1) (2018-10-03)


### Bug Fixes

* **admin:** use new Badge component in pages ([85eb9ff](https://github.com/edenlabllc/ehealth.web/commit/85eb9ff))





<a name="0.97.0"></a>
# [0.97.0](https://github.com/edenlabllc/ehealth.web/compare/v0.96.0...v0.97.0) (2018-10-03)


### Features

* **admin:** add nhsVerify and deactive LegalEntities mutation ([26707d3](https://github.com/edenlabllc/ehealth.web/commit/26707d3))





<a name="0.96.0"></a>
# [0.96.0](https://github.com/edenlabllc/ehealth.web/compare/v0.95.0...v0.96.0) (2018-10-02)


### Features

* **admin:** add RelatedLegalEntities tab ([d8aa677](https://github.com/edenlabllc/ehealth.web/commit/d8aa677))





<a name="0.95.0"></a>
# [0.95.0](https://github.com/edenlabllc/ehealth.web/compare/v0.94.1...v0.95.0) (2018-10-02)


### Bug Fixes

* **admin:** use StatusBlock from Badge, add color status to theme ([1fc4ae7](https://github.com/edenlabllc/ehealth.web/commit/1fc4ae7))


### Features

* **admin:** add graphql query for settlements ([6957c92](https://github.com/edenlabllc/ehealth.web/commit/6957c92))
* **admin:** add LegalEntity details ([b93fdfd](https://github.com/edenlabllc/ehealth.web/commit/b93fdfd))
* **admin:** add LegalEntity list ([577b045](https://github.com/edenlabllc/ehealth.web/commit/577b045))
* **admin:** add page LegalEntities to router and navigation ([40d4a32](https://github.com/edenlabllc/ehealth.web/commit/40d4a32))
* **admin:** add pkj final-form-calculate for decorate final form ([8fd1153](https://github.com/edenlabllc/ehealth.web/commit/8fd1153))
* **admin:** add StatusBlock component for render status cell in Table ([83f1d73](https://github.com/edenlabllc/ehealth.web/commit/83f1d73))
* **admin:** add statuses for LegalEntities ([ec72095](https://github.com/edenlabllc/ehealth.web/commit/ec72095))
* **admin:** add title to cell in TableBody ([8c63b9d](https://github.com/edenlabllc/ehealth.web/commit/8c63b9d))





<a name="0.94.1"></a>
## [0.94.1](https://github.com/edenlabllc/ehealth.web/compare/v0.94.0...v0.94.1) (2018-10-02)

**Note:** Version bump only for package @ehealth/admin





<a name="0.94.0"></a>
# [0.94.0](https://github.com/edenlabllc/ehealth.web/compare/v0.93.2...v0.94.0) (2018-10-02)


### Features

* **admin:** fix params comparison ([1250617](https://github.com/edenlabllc/ehealth.web/commit/1250617))





<a name="0.93.2"></a>
## [0.93.2](https://github.com/edenlabllc/ehealth.web/compare/v0.93.1...v0.93.2) (2018-10-02)


### Bug Fixes

* **admin:** fix datepicker ([b6996f6](https://github.com/edenlabllc/ehealth.web/commit/b6996f6))





<a name="0.93.1"></a>
## [0.93.1](https://github.com/edenlabllc/ehealth.web/compare/v0.93.0...v0.93.1) (2018-10-01)

**Note:** Version bump only for package @ehealth/admin





<a name="0.93.0"></a>
# [0.93.0](https://github.com/edenlabllc/ehealth.web/compare/v0.92.4...v0.93.0) (2018-10-01)


### Bug Fixes

* **admin:** add breadcrumbs to Persons page ([e498131](https://github.com/edenlabllc/ehealth.web/commit/e498131))
* **admin:** fix declaration details features ([c174a3c](https://github.com/edenlabllc/ehealth.web/commit/c174a3c))
* **admin:** use reach router redirect ([6350f81](https://github.com/edenlabllc/ehealth.web/commit/6350f81))
* **components:** add arrow width ([818a258](https://github.com/edenlabllc/ehealth.web/commit/818a258))
* **components:** invert active/non-active styles ([ff41f02](https://github.com/edenlabllc/ehealth.web/commit/ff41f02))


### Features

* **admin:** add Approve, Reject, Terminate mutations ([546db11](https://github.com/edenlabllc/ehealth.web/commit/546db11))





<a name="0.92.4"></a>
## [0.92.4](https://github.com/edenlabllc/ehealth.web/compare/v0.92.3...v0.92.4) (2018-09-28)

**Note:** Version bump only for package @ehealth/admin





<a name="0.92.3"></a>
## [0.92.3](https://github.com/edenlabllc/ehealth.web/compare/v0.92.2...v0.92.3) (2018-09-28)

**Note:** Version bump only for package @ehealth/admin





<a name="0.92.2"></a>
## [0.92.2](https://github.com/edenlabllc/ehealth.web/compare/v0.92.1...v0.92.2) (2018-09-28)

**Note:** Version bump only for package @ehealth/admin





<a name="0.92.1"></a>
## [0.92.1](https://github.com/edenlabllc/ehealth.web/compare/v0.92.0...v0.92.1) (2018-09-28)

**Note:** Version bump only for package @ehealth/admin





<a name="0.92.0"></a>
# [0.92.0](https://github.com/edenlabllc/ehealth.web/compare/v0.91.1...v0.92.0) (2018-09-28)


### Bug Fixes

* **admin:** fix typos ([14d5e3b](https://github.com/edenlabllc/ehealth.web/commit/14d5e3b))


### Features

* **admin:** add async jobs feature definitions ([0331e91](https://github.com/edenlabllc/ehealth.web/commit/0331e91))





<a name="0.91.1"></a>
## [0.91.1](https://github.com/edenlabllc/ehealth.web/compare/v0.91.0...v0.91.1) (2018-09-26)


### Bug Fixes

* **admin:** change name filterTableColumn as default props use in Table ([3e23b2b](https://github.com/edenlabllc/ehealth.web/commit/3e23b2b))





<a name="0.91.0"></a>
# [0.91.0](https://github.com/edenlabllc/ehealth.web/compare/v0.88.1...v0.91.0) (2018-09-25)


### Bug Fixes

* **admin:** change DateField to return ISO date, fix DateField appearance ([ddca645](https://github.com/edenlabllc/ehealth.web/commit/ddca645))
* **admin:** change default font to Montserrat ([a1f6521](https://github.com/edenlabllc/ehealth.web/commit/a1f6521))
* **admin:** change styles according to new font-family and body styles ([9cbb877](https://github.com/edenlabllc/ehealth.web/commit/9cbb877))
* **admin:** fix more typos ([0653aa0](https://github.com/edenlabllc/ehealth.web/commit/0653aa0))
* **admin:** fix typo, use hyphens in URLs ([17c2d48](https://github.com/edenlabllc/ehealth.web/commit/17c2d48))
* **admin:** move box-sizing styles up ([bd33669](https://github.com/edenlabllc/ehealth.web/commit/bd33669))


### Features

* **admin:** add alternate Tabs component ([0c9295b](https://github.com/edenlabllc/ehealth.web/commit/0c9295b))
* **admin:** add Details component ([7d1e5da](https://github.com/edenlabllc/ehealth.web/commit/7d1e5da))
* **admin:** add persons search page ([7d327da](https://github.com/edenlabllc/ehealth.web/commit/7d327da)), closes [#285](https://github.com/edenlabllc/ehealth.web/issues/285)
* **admin:** remove cyrillic-ext and remove italic from import ([b0cec8b](https://github.com/edenlabllc/ehealth.web/commit/b0cec8b))
* **admin:** show Modal when press reset auth method ([0a709a2](https://github.com/edenlabllc/ehealth.web/commit/0a709a2))





<a name="0.90.0"></a>
# [0.90.0](https://github.com/edenlabllc/ehealth.web/compare/v0.88.1...v0.90.0) (2018-09-25)


### Bug Fixes

* **admin:** change DateField to return ISO date, fix DateField appearance ([ddca645](https://github.com/edenlabllc/ehealth.web/commit/ddca645))
* **admin:** change default font to Montserrat ([a1f6521](https://github.com/edenlabllc/ehealth.web/commit/a1f6521))
* **admin:** change styles according to new font-family and body styles ([9cbb877](https://github.com/edenlabllc/ehealth.web/commit/9cbb877))
* **admin:** fix more typos ([0653aa0](https://github.com/edenlabllc/ehealth.web/commit/0653aa0))
* **admin:** fix typo, use hyphens in URLs ([17c2d48](https://github.com/edenlabllc/ehealth.web/commit/17c2d48))
* **admin:** move box-sizing styles up ([bd33669](https://github.com/edenlabllc/ehealth.web/commit/bd33669))


### Features

* **admin:** add alternate Tabs component ([0c9295b](https://github.com/edenlabllc/ehealth.web/commit/0c9295b))
* **admin:** add Details component ([7d1e5da](https://github.com/edenlabllc/ehealth.web/commit/7d1e5da))
* **admin:** add persons search page ([7d327da](https://github.com/edenlabllc/ehealth.web/commit/7d327da)), closes [#285](https://github.com/edenlabllc/ehealth.web/issues/285)
* **admin:** remove cyrillic-ext and remove italic from import ([b0cec8b](https://github.com/edenlabllc/ehealth.web/commit/b0cec8b))
* **admin:** show Modal when press reset auth method ([0a709a2](https://github.com/edenlabllc/ehealth.web/commit/0a709a2))





<a name="0.89.0"></a>
# [0.89.0](https://github.com/edenlabllc/ehealth.web/compare/v0.88.1...v0.89.0) (2018-09-25)


### Bug Fixes

* **admin:** change DateField to return ISO date, fix DateField appearance ([ddca645](https://github.com/edenlabllc/ehealth.web/commit/ddca645))
* **admin:** fix more typos ([0653aa0](https://github.com/edenlabllc/ehealth.web/commit/0653aa0))
* **admin:** fix typo, use hyphens in URLs ([17c2d48](https://github.com/edenlabllc/ehealth.web/commit/17c2d48))


### Features

* **admin:** add alternate Tabs component ([0c9295b](https://github.com/edenlabllc/ehealth.web/commit/0c9295b))
* **admin:** add Details component ([7d1e5da](https://github.com/edenlabllc/ehealth.web/commit/7d1e5da))
* **admin:** add persons search page ([7d327da](https://github.com/edenlabllc/ehealth.web/commit/7d327da)), closes [#285](https://github.com/edenlabllc/ehealth.web/issues/285)





<a name="0.88.0"></a>
# [0.88.0](https://github.com/edenlabllc/ehealth.web/compare/v0.86.0...v0.88.0) (2018-09-24)


### Features

* **admin:** add RadioButton component ([a94ea5e](https://github.com/edenlabllc/ehealth.web/commit/a94ea5e))





<a name="0.87.0"></a>
# [0.87.0](https://github.com/edenlabllc/ehealth.web/compare/v0.86.0...v0.87.0) (2018-09-24)


### Features

* **admin:** add RadioButton component ([a94ea5e](https://github.com/edenlabllc/ehealth.web/commit/a94ea5e))





<a name="0.86.0"></a>
# [0.86.0](https://github.com/edenlabllc/ehealth.web/compare/v0.85.1...v0.86.0) (2018-09-24)


### Features

* **admin:** add resetAuthMethod mutation ([a1cd531](https://github.com/edenlabllc/ehealth.web/commit/a1cd531))





<a name="0.85.0"></a>
# [0.85.0](https://github.com/edenlabllc/ehealth.web/compare/v0.84.0...v0.85.0) (2018-09-21)


### Bug Fixes

* **admin:** add birthSettlement to query ([08b551f](https://github.com/edenlabllc/ehealth.web/commit/08b551f))
* **admin:** add default value to labelWidth ([5f1cf87](https://github.com/edenlabllc/ehealth.web/commit/5f1cf87))
* **admin:** fix settlementType ([289e134](https://github.com/edenlabllc/ehealth.web/commit/289e134))
* **admin:** fix statuses and address ([d3a799b](https://github.com/edenlabllc/ehealth.web/commit/d3a799b))
* **admin:** remove unused fields ([3ffc263](https://github.com/edenlabllc/ehealth.web/commit/3ffc263))
* **admin:** use Text from rebass, fix second column width ([fb8a671](https://github.com/edenlabllc/ehealth.web/commit/fb8a671))


### Features

* **admin:** add fontWeight as default prop in Link ([e958973](https://github.com/edenlabllc/ehealth.web/commit/e958973))
* **admin:** add person statuses ([9d35f37](https://github.com/edenlabllc/ehealth.web/commit/9d35f37))
* **admin:** declaration details page ([87ce640](https://github.com/edenlabllc/ehealth.web/commit/87ce640))





<a name="0.84.0"></a>
# [0.84.0](https://github.com/edenlabllc/ehealth.web/compare/v0.83.2...v0.84.0) (2018-09-21)

**Note:** Version bump only for package @ehealth/admin





<a name="0.83.0"></a>
# [0.83.0](https://github.com/edenlabllc/ehealth.web/compare/v0.82.0...v0.83.0) (2018-09-18)


### Bug Fixes

* **admin:** add additional comparison ([c138168](https://github.com/edenlabllc/ehealth.web/commit/c138168))
* **admin:** add centering in Badge component ([0af3e4d](https://github.com/edenlabllc/ehealth.web/commit/0af3e4d))
* **admin:** add icon to input ([745c374](https://github.com/edenlabllc/ehealth.web/commit/745c374))
* **admin:** add Select and MultiSelect to index ([bc91328](https://github.com/edenlabllc/ehealth.web/commit/bc91328))
* **admin:** add zIndex to Dropdown list ([940fa85](https://github.com/edenlabllc/ehealth.web/commit/940fa85))
* **admin:** change keys in statuses according to API ([a8d781e](https://github.com/edenlabllc/ehealth.web/commit/a8d781e))
* **admin:** change overflow in Table component ([416207e](https://github.com/edenlabllc/ehealth.web/commit/416207e))
* **admin:** fix fontWeight inheritance ([f7d98e5](https://github.com/edenlabllc/ehealth.web/commit/f7d98e5))
* **admin:** fix maxWidth ([2afcfec](https://github.com/edenlabllc/ehealth.web/commit/2afcfec))
* **admin:** fix table sorting, add initialValues to the form ([bd03460](https://github.com/edenlabllc/ehealth.web/commit/bd03460))
* **admin:** move mb to default props ([ddc41eb](https://github.com/edenlabllc/ehealth.web/commit/ddc41eb))
* **admin:** remove flex as default from prefix and postfix ([d820ad0](https://github.com/edenlabllc/ehealth.web/commit/d820ad0))
* **admin:** remove unnecessary compare in tabs ([28c3147](https://github.com/edenlabllc/ehealth.web/commit/28c3147))
* **admin:** remove unnecessary comparison ([e97d4f1](https://github.com/edenlabllc/ehealth.web/commit/e97d4f1))
* **admin:** remove unnecessary template string ([787726b](https://github.com/edenlabllc/ehealth.web/commit/787726b))
* **admin:** remove unnecessary template string and compare ([aa569d5](https://github.com/edenlabllc/ehealth.web/commit/aa569d5))
* **admin:** remove unused fields and rename query ([dfb1ed4](https://github.com/edenlabllc/ehealth.web/commit/dfb1ed4))
* **admin:** use [@reach](https://github.com/reach)/router in Breadcrumbs ([76060e6](https://github.com/edenlabllc/ehealth.web/commit/76060e6))


### Features

* **admin:** add AddressView component ([8433dfa](https://github.com/edenlabllc/ehealth.web/commit/8433dfa))
* **admin:** add DefinitionListView component ([91f846f](https://github.com/edenlabllc/ehealth.web/commit/91f846f))
* **admin:** PatientDetails page ([6a5f4ff](https://github.com/edenlabllc/ehealth.web/commit/6a5f4ff))





<a name="0.82.0"></a>
# [0.82.0](https://github.com/edenlabllc/ehealth.web/compare/v0.81.0...v0.82.0) (2018-09-18)

**Note:** Version bump only for package @ehealth/admin





<a name="0.81.0"></a>
# [0.81.0](https://github.com/edenlabllc/ehealth.web/compare/v0.80.2...v0.81.0) (2018-09-18)


### Features

* **admin:** add MultiSelect component ([53f5264](https://github.com/edenlabllc/ehealth.web/commit/53f5264))
* **admin:** add Select component ([0c3b22b](https://github.com/edenlabllc/ehealth.web/commit/0c3b22b))
* **admin:** add Select component, add DownshiftField wrappers for Select and MultiSelect components ([47008ca](https://github.com/edenlabllc/ehealth.web/commit/47008ca))
* **admin:** add SelectList component, which using in Select and Multiselect components ([87f46aa](https://github.com/edenlabllc/ehealth.web/commit/87f46aa))





<a name="0.80.0"></a>
# [0.80.0](https://github.com/edenlabllc/ehealth.web/compare/v0.79.1...v0.80.0) (2018-09-18)

**Note:** Version bump only for package @ehealth/admin





<a name="0.79.1"></a>
## [0.79.1](https://github.com/edenlabllc/ehealth.web/compare/v0.79.0...v0.79.1) (2018-09-17)


### Bug Fixes

* make consistent system-components and dependents ([6ebcb25](https://github.com/edenlabllc/ehealth.web/commit/6ebcb25))





<a name="0.79.0"></a>
# [0.79.0](https://github.com/edenlabllc/ehealth.web/compare/v0.78.0...v0.79.0) (2018-09-14)


### Bug Fixes

* **admin:** clean DateField ([1f811af](https://github.com/edenlabllc/ehealth.web/commit/1f811af))
* **admin:** increase max-width ([c0fd588](https://github.com/edenlabllc/ehealth.web/commit/c0fd588))
* **admin:** move flex and maxWidth to defaultProps ([51bf721](https://github.com/edenlabllc/ehealth.web/commit/51bf721))
* **admin:** RangeDateField ([fe66af2](https://github.com/edenlabllc/ehealth.web/commit/fe66af2))


### Features

* **admin:** combine field and datepicker ([37ff83e](https://github.com/edenlabllc/ehealth.web/commit/37ff83e))





<a name="0.78.0"></a>
# [0.78.0](https://github.com/edenlabllc/ehealth.web/compare/v0.77.1...v0.78.0) (2018-09-13)


### Features

* **admin:** use HttpLink as data layer ([2fc70af](https://github.com/edenlabllc/ehealth.web/commit/2fc70af))





<a name="0.77.1"></a>
## [0.77.1](https://github.com/edenlabllc/ehealth.web/compare/v0.77.0...v0.77.1) (2018-09-13)


### Bug Fixes

* upgrade graphql to 0.13.2 ([35c2170](https://github.com/edenlabllc/ehealth.web/commit/35c2170))





<a name="0.77.0"></a>
# [0.77.0](https://github.com/edenlabllc/ehealth.web/compare/v0.76.1...v0.77.0) (2018-09-13)


### Bug Fixes

* **admin:** add min-width for Dropdown component ([d307b35](https://github.com/edenlabllc/ehealth.web/commit/d307b35))
* **admin:** delete TableDropdown component ([369d2d5](https://github.com/edenlabllc/ehealth.web/commit/369d2d5))


### Features

* **admin:** add AdminTable component ([7a53d5e](https://github.com/edenlabllc/ehealth.web/commit/7a53d5e))
* **admin:** add declaration details feature ([c498b19](https://github.com/edenlabllc/ehealth.web/commit/c498b19))
* **admin:** add features for legal entities ([b4a47a4](https://github.com/edenlabllc/ehealth.web/commit/b4a47a4))
* **admin:** add flow type for table components ([3660021](https://github.com/edenlabllc/ehealth.web/commit/3660021))
* **admin:** add helpers for statuses in table ([9013de1](https://github.com/edenlabllc/ehealth.web/commit/9013de1))
* **admin:** add more scenarios to person details feature ([304ffd5](https://github.com/edenlabllc/ehealth.web/commit/304ffd5))
* **admin:** add person features ([ec05fde](https://github.com/edenlabllc/ehealth.web/commit/ec05fde))





<a name="0.76.0"></a>
# [0.76.0](https://github.com/edenlabllc/ehealth.web/compare/v0.75.0...v0.76.0) (2018-09-10)


### Bug Fixes

* use consistent graphql version across all packages ([5259433](https://github.com/edenlabllc/ehealth.web/commit/5259433))


### Features

* **admin:** Clipboard component ([c8890bd](https://github.com/edenlabllc/ehealth.web/commit/c8890bd))





<a name="0.75.0"></a>
# [0.75.0](https://github.com/edenlabllc/ehealth.web/compare/v0.74.0...v0.75.0) (2018-09-07)


### Bug Fixes

* **admin:** fix link on error page ([3a19f05](https://github.com/edenlabllc/ehealth.web/commit/3a19f05))


### Features

* **admin:** LocationParams component ([7955f82](https://github.com/edenlabllc/ehealth.web/commit/7955f82))





<a name="0.74.0"></a>
# [0.74.0](https://github.com/edenlabllc/ehealth.web/compare/v0.73.0...v0.74.0) (2018-09-06)


### Features

* **admin:** bootstrap router ([90ea32f](https://github.com/edenlabllc/ehealth.web/commit/90ea32f))





<a name="0.73.0"></a>
# [0.73.0](https://github.com/edenlabllc/ehealth.web/compare/v0.72.0...v0.73.0) (2018-09-05)


### Bug Fixes

* **admin:** adjust Button default paddings ([2c9b603](https://github.com/edenlabllc/ehealth.web/commit/2c9b603))
* **admin:** fix theme import ([b611e66](https://github.com/edenlabllc/ehealth.web/commit/b611e66))


### Features

* **admin:** add FieldView and InputView components ([0f675a4](https://github.com/edenlabllc/ehealth.web/commit/0f675a4))
* **admin:** add font-family to theme ([06201a8](https://github.com/edenlabllc/ehealth.web/commit/06201a8))
* **admin:** add InputField component ([5614747](https://github.com/edenlabllc/ehealth.web/commit/5614747)), closes [#218](https://github.com/edenlabllc/ehealth.web/issues/218)
* **admin:** add textarea and different input types, refactor input components ([a7b5148](https://github.com/edenlabllc/ehealth.web/commit/a7b5148)), closes [#222](https://github.com/edenlabllc/ehealth.web/issues/222)





<a name="0.72.0"></a>
# [0.72.0](https://github.com/edenlabllc/ehealth.web/compare/v0.71.4...v0.72.0) (2018-09-05)


### Features

* **admin:** error handling ([c3d839a](https://github.com/edenlabllc/ehealth.web/commit/c3d839a))





<a name="0.71.3"></a>
## [0.71.3](https://github.com/edenlabllc/ehealth.web/compare/v0.71.2...v0.71.3) (2018-09-04)

**Note:** Version bump only for package @ehealth/admin





<a name="0.71.0"></a>
# [0.71.0](https://github.com/edenlabllc/ehealth.web/compare/v0.70.3...v0.71.0) (2018-08-31)


### Features

* **admin:** tooltip component ([3eac173](https://github.com/edenlabllc/ehealth.web/commit/3eac173))





<a name="0.70.1"></a>
## [0.70.1](https://github.com/edenlabllc/ehealth.web/compare/v0.70.0...v0.70.1) (2018-08-29)

**Note:** Version bump only for package @ehealth/admin





<a name="0.70.0"></a>
# [0.70.0](https://github.com/edenlabllc/ehealth.web/compare/v0.68.0...v0.70.0) (2018-08-29)


### Features

* **admin:** add Pagination component ([#260](https://github.com/edenlabllc/ehealth.web/issues/260)) ([a0a565f](https://github.com/edenlabllc/ehealth.web/commit/a0a565f))
* **admin:** dropdown component ([b907d50](https://github.com/edenlabllc/ehealth.web/commit/b907d50))





<a name="0.69.0"></a>
# [0.69.0](https://github.com/edenlabllc/ehealth.web/compare/v0.68.0...v0.69.0) (2018-08-29)


### Features

* **admin:** add Pagination component ([#260](https://github.com/edenlabllc/ehealth.web/issues/260)) ([a0a565f](https://github.com/edenlabllc/ehealth.web/commit/a0a565f))
* **admin:** dropdown component ([b907d50](https://github.com/edenlabllc/ehealth.web/commit/b907d50))





<a name="0.68.0"></a>
# [0.68.0](https://github.com/edenlabllc/ehealth.web/compare/v0.67.0...v0.68.0) (2018-08-29)


### Bug Fixes

* fix styled-system versions ([f8c8376](https://github.com/edenlabllc/ehealth.web/commit/f8c8376))
* use nginx:stable-alpine Docker image as base ([e60c0cc](https://github.com/edenlabllc/ehealth.web/commit/e60c0cc))


### Features

* **admin:** establish spacing and fontSizes in the theme ([0355ef8](https://github.com/edenlabllc/ehealth.web/commit/0355ef8))





<a name="0.67.0"></a>
# [0.67.0](https://github.com/edenlabllc/ehealth.web/compare/v0.66.0...v0.67.0) (2018-08-28)


### Features

* **admin:** add Steps component ([#258](https://github.com/edenlabllc/ehealth.web/issues/258)) ([7c1c90a](https://github.com/edenlabllc/ehealth.web/commit/7c1c90a))





<a name="0.66.0"></a>
# [0.66.0](https://github.com/edenlabllc/ehealth.web/compare/v0.64.0...v0.66.0) (2018-08-28)


### Features

* **admin:** add Ability component ([d8cd8b3](https://github.com/edenlabllc/ehealth.web/commit/d8cd8b3))
* **admin:** add Nav component ([d4ee027](https://github.com/edenlabllc/ehealth.web/commit/d4ee027)), closes [#202](https://github.com/edenlabllc/ehealth.web/issues/202)





<a name="0.65.0"></a>
# [0.65.0](https://github.com/edenlabllc/ehealth.web/compare/v0.64.0...v0.65.0) (2018-08-28)

**Note:** Version bump only for package @ehealth/admin





<a name="0.64.0"></a>
# [0.64.0](https://github.com/edenlabllc/ehealth.web/compare/v0.63.0...v0.64.0) (2018-08-27)


### Features

* **components:** add Tabs component ([#251](https://github.com/edenlabllc/ehealth.web/issues/251)) ([4a00ea2](https://github.com/edenlabllc/ehealth.web/commit/4a00ea2))





<a name="0.63.0"></a>
# [0.63.0](https://github.com/edenlabllc/ehealth.web/compare/v0.62.2...v0.63.0) (2018-08-23)

**Note:** Version bump only for package @ehealth/admin





<a name="0.62.0"></a>
# [0.62.0](https://github.com/edenlabllc/ehealth.web/compare/v0.61.0...v0.62.0) (2018-08-23)


### Bug Fixes

* **admin:** remove styled-system ([b2ff674](https://github.com/edenlabllc/ehealth.web/commit/b2ff674))


### Features

* **admin:** add colors to theme ([7f5abfb](https://github.com/edenlabllc/ehealth.web/commit/7f5abfb))
* **admin:** add disable and alfa carbon ([5c9bb2f](https://github.com/edenlabllc/ehealth.web/commit/5c9bb2f))
* **admin:** add fonts ([1ca5c54](https://github.com/edenlabllc/ehealth.web/commit/1ca5c54))
* **admin:** add globalStyles ([6ad7105](https://github.com/edenlabllc/ehealth.web/commit/6ad7105))
* **admin:** add styled-system ([36cdf51](https://github.com/edenlabllc/ehealth.web/commit/36cdf51))
* **admin:** btn component ([49234cf](https://github.com/edenlabllc/ehealth.web/commit/49234cf))
* **admin:** update theme with buttons styles ([fe0e422](https://github.com/edenlabllc/ehealth.web/commit/fe0e422))





<a name="0.61.0"></a>
# [0.61.0](https://github.com/edenlabllc/ehealth.web/compare/v0.60.0...v0.61.0) (2018-08-22)


### Features

* **components:** add Badge component ([c1cc886](https://github.com/edenlabllc/ehealth.web/commit/c1cc886))





<a name="0.60.0"></a>
# [0.60.0](https://github.com/edenlabllc/ehealth.web/compare/v0.59.9...v0.60.0) (2018-08-20)

**Note:** Version bump only for package @ehealth/admin





<a name="0.59.8"></a>
## [0.59.8](https://github.com/edenlabllc/ehealth.web/compare/v0.59.7...v0.59.8) (2018-08-20)

**Note:** Version bump only for package @ehealth/admin





<a name="0.59.2"></a>

## [0.59.2](https://github.com/edenlabllc/ehealth.web/compare/v0.59.1...v0.59.2) (2018-08-16)

### Bug Fixes

- get polyfills from same origin ([c4a0102](https://github.com/edenlabllc/ehealth.web/commit/c4a0102))

<a name="0.59.0"></a>

# [0.59.0](https://github.com/edenlabllc/ehealth.web/compare/v0.58.1...v0.59.0) (2018-08-15)

### Features

- **admin:** add base layout ([e6edd29](https://github.com/edenlabllc/ehealth.web/commit/e6edd29))

<a name="0.58.1"></a>

## [0.58.1](https://github.com/edenlabllc/ehealth.web/compare/v0.58.0...v0.58.1) (2018-08-15)

**Note:** Version bump only for package @ehealth/admin

<a name="0.58.0"></a>

# [0.58.0](https://github.com/edenlabllc/ehealth.web/compare/v0.57.1...v0.58.0) (2018-08-13)

**Note:** Version bump only for package @ehealth/admin

<a name="0.57.1"></a>

## [0.57.1](https://github.com/edenlabllc/ehealth.web/compare/v0.57.0...v0.57.1) (2018-08-10)

### Bug Fixes

- add build tools install step to dockerfiles, fix runtime dependency filtering ([c415741](https://github.com/edenlabllc/ehealth.web/commit/c415741))

<a name="0.57.0"></a>

# [0.57.0](https://github.com/edenlabllc/ehealth.web/compare/v0.56.3...v0.57.0) (2018-08-09)

### Features

- add new polyfill-service, delete old polyfills ([cd04a73](https://github.com/edenlabllc/ehealth.web/commit/cd04a73))

<a name="0.56.3"></a>

## [0.56.3](https://github.com/edenlabllc/ehealth.web/compare/v0.56.2...v0.56.3) (2018-08-09)

**Note:** Version bump only for package @ehealth/admin

<a name="0.56.2"></a>

## [0.56.2](https://github.com/edenlabllc/ehealth.web/compare/v0.56.1...v0.56.2) (2018-08-08)

**Note:** Version bump only for package @ehealth/admin

<a name="0.56.1"></a>

## [0.56.1](https://github.com/edenlabllc/ehealth.web/compare/v0.56.0...v0.56.1) (2018-08-08)

**Note:** Version bump only for package @ehealth/admin

<a name="0.56.0"></a>

# [0.56.0](https://github.com/edenlabllc/ehealth.web/compare/v0.55.2...v0.56.0) (2018-08-08)

**Note:** Version bump only for package @ehealth/admin

<a name="0.55.2"></a>

## [0.55.2](https://github.com/edenlabllc/ehealth.web/compare/v0.55.1...v0.55.2) (2018-08-08)

**Note:** Version bump only for package @ehealth/admin

<a name="0.55.1"></a>

## [0.55.1](https://github.com/edenlabllc/ehealth.web/compare/v0.55.0...v0.55.1) (2018-08-07)

### Bug Fixes

- downgrade react-scripts to 2.0.0-next.66cc7a90 ([d3785cb](https://github.com/edenlabllc/ehealth.web/commit/d3785cb))

<a name="0.55.0"></a>

# [0.55.0](https://github.com/edenlabllc/ehealth.web/compare/v0.54.0...v0.55.0) (2018-08-07)

### Features

- **admin:** bootstrap package ([78e6afc](https://github.com/edenlabllc/ehealth.web/commit/78e6afc)), closes [#184](https://github.com/edenlabllc/ehealth.web/issues/184)
