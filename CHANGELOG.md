# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="0.11.0"></a>
# [0.11.0](https://github.com/edenlabllc/ehealth.web/compare/v0.10.1...v0.11.0) (2018-05-14)


### Bug Fixes

* **auth:** add missing dispatch call to post-register login action ([83007f4](https://github.com/edenlabllc/ehealth.web/commit/83007f4))


### Features

* **env:** bootstrap package ([b62158d](https://github.com/edenlabllc/ehealth.web/commit/b62158d))





<a name="0.10.1"></a>
## [0.10.1](https://github.com/edenlabllc/ehealth.web/compare/v0.10.0...v0.10.1) (2018-05-14)


### Bug Fixes

* **auth:** use cabinet client on auth ([983ddcc](https://github.com/edenlabllc/ehealth.web/commit/983ddcc))





<a name="0.10.0"></a>
# [0.10.0](https://github.com/edenlabllc/ehealth.web/compare/v0.9.1...v0.10.0) (2018-05-13)


### Bug Fixes

* **patient-account:** add missing nginx.conf ([57789c4](https://github.com/edenlabllc/ehealth.web/commit/57789c4))


### Features

* load DigitalSignature dynamically ([dc4faa3](https://github.com/edenlabllc/ehealth.web/commit/dc4faa3))
* upgrade lerna to 3.0.0-beta.21 ([bef22ae](https://github.com/edenlabllc/ehealth.web/commit/bef22ae))
* use `npm ci` and `lerna bootstrap --ci` in dockerfiles ([c473984](https://github.com/edenlabllc/ehealth.web/commit/c473984))
* **icons:** add EhealthLogoIcon ([bba6993](https://github.com/edenlabllc/ehealth.web/commit/bba6993))
* **iit-digital-signature:** replace webpack with rollup ([8233e77](https://github.com/edenlabllc/ehealth.web/commit/8233e77))
* **patient-account:** bootstrap package ([aee7d0e](https://github.com/edenlabllc/ehealth.web/commit/aee7d0e))
* **patient-account:** setup routing and data fetching ([9594428](https://github.com/edenlabllc/ehealth.web/commit/9594428))





<a name="0.9.1"></a>
## [0.9.1](https://github.com/edenlabllc/ehealth.web/compare/v0.9.0...v0.9.1) (2018-05-10)


### Bug Fixes

* **auth:** use client_id and redirect_uri from params to apps/authorize ([a599837](https://github.com/edenlabllc/ehealth.web/commit/a599837))




<a name="0.9.0"></a>
# [0.9.0](https://github.com/edenlabllc/ehealth.web/compare/v0.8.2...v0.9.0) (2018-05-09)


### Bug Fixes

* **auth:** add padding for main layout ([9b8fef0](https://github.com/edenlabllc/ehealth.web/commit/9b8fef0))
* **auth:** update btn text in sign-in form ([ac4ee44](https://github.com/edenlabllc/ehealth.web/commit/ac4ee44)), closes [#5](https://github.com/edenlabllc/ehealth.web/issues/5)
* **auth:** use client_id from params for sign-in submit fn ([15a2990](https://github.com/edenlabllc/ehealth.web/commit/15a2990))
* **auth:** user config client_id for session token generation ([c459866](https://github.com/edenlabllc/ehealth.web/commit/c459866))


### Features

* **auth:** add getNonce action, add drfo header to createSessionToken action ([3453ef8](https://github.com/edenlabllc/ehealth.web/commit/3453ef8))
* **auth:** add sign-in logic for Otp page ([0ede426](https://github.com/edenlabllc/ehealth.web/commit/0ede426)), closes [#5](https://github.com/edenlabllc/ehealth.web/issues/5)
* **auth:** add sign-in route ([7bd1a65](https://github.com/edenlabllc/ehealth.web/commit/7bd1a65)), closes [#5](https://github.com/edenlabllc/ehealth.web/issues/5)
* **auth:** add verifying the cliend_id and redirect_uri in query in sign-in page, add DS button ([030b8c3](https://github.com/edenlabllc/ehealth.web/commit/030b8c3)), closes [#5](https://github.com/edenlabllc/ehealth.web/issues/5)
* **auth:** DS Sign-in page ([8e3e072](https://github.com/edenlabllc/ehealth.web/commit/8e3e072))
* **auth:** enable flow with default scope for cabinet client in otp page ([e8d7c41](https://github.com/edenlabllc/ehealth.web/commit/e8d7c41))
* **auth:** get client_id from params for sign-in page ([1a40d46](https://github.com/edenlabllc/ehealth.web/commit/1a40d46))


### Reverts

* "Sign-in flow. Connects to [#5](https://github.com/edenlabllc/ehealth.web/issues/5) ([#35](https://github.com/edenlabllc/ehealth.web/issues/35))" ([af11b29](https://github.com/edenlabllc/ehealth.web/commit/af11b29))




<a name="0.8.2"></a>
## [0.8.2](https://github.com/edenlabllc/ehealth.web/compare/v0.8.1...v0.8.2) (2018-05-07)


### Bug Fixes

* **auth:** use new Form CheckField Component in InviteAccept Form ([62c4637](https://github.com/edenlabllc/ehealth.web/commit/62c4637))




<a name="0.8.1"></a>
## [0.8.1](https://github.com/edenlabllc/ehealth.web/compare/v0.8.0...v0.8.1) (2018-05-04)




**Note:** Version bump only for package undefined

<a name="0.8.0"></a>
# [0.8.0](https://github.com/edenlabllc/ehealth.web/compare/v0.7.2...v0.8.0) (2018-05-04)


### Bug Fixes

* **components:** add missing final-form-set-field-data mutator ([257be87](https://github.com/edenlabllc/ehealth.web/commit/257be87))
* **components:** add missing SUBMIT_ERROR export ([c7bd6e5](https://github.com/edenlabllc/ehealth.web/commit/c7bd6e5))
* **components:** fix SUBMIT_ERRORS import in SubmitValidation component ([67dd2c4](https://github.com/edenlabllc/ehealth.web/commit/67dd2c4))


### Features

* **auth:** add server-side validations to sign up form ([b3323cb](https://github.com/edenlabllc/ehealth.web/commit/b3323cb)), closes [#3](https://github.com/edenlabllc/ehealth.web/issues/3)
* **components:** add SumbitValidation component ([9461f54](https://github.com/edenlabllc/ehealth.web/commit/9461f54))
* **components:** bump final-form to 4.6.1 and react-final-form to 3.4.0 ([715f6d3](https://github.com/edenlabllc/ehealth.web/commit/715f6d3))




<a name="0.7.2"></a>
## [0.7.2](https://github.com/edenlabllc/ehealth.web/compare/v0.7.1...v0.7.2) (2018-05-02)




**Note:** Version bump only for package undefined

<a name="0.7.1"></a>
## [0.7.1](https://github.com/edenlabllc/ehealth.web/compare/v0.7.0...v0.7.1) (2018-05-02)


### Bug Fixes

* **auth:** add ability to set DS proxy server address in environment variable ([f43a934](https://github.com/edenlabllc/ehealth.web/commit/f43a934))
* **react-iit-digital-signature:** add ability to configure proxy server address ([7b845a0](https://github.com/edenlabllc/ehealth.web/commit/7b845a0))




<a name="0.7.0"></a>
# [0.7.0](https://github.com/edenlabllc/ehealth.web/compare/v0.6.1...v0.7.0) (2018-05-02)


### Features

* **iit-proxy:** add Dockerfile and container structure test config ([a4f5812](https://github.com/edenlabllc/ehealth.web/commit/a4f5812))




<a name="0.6.1"></a>
## [0.6.1](https://github.com/edenlabllc/ehealth.web/compare/v0.6.0...v0.6.1) (2018-04-29)


### Bug Fixes

* **iit-digital-signature:** transpile code to prevent unexpected errors when consuming by CRA apps ([2076bdb](https://github.com/edenlabllc/ehealth.web/commit/2076bdb))




<a name="0.6.0"></a>
# 0.6.0 (2018-04-27)


### Bug Fixes

* **auth:** fix sign up route order, remove dead styles ([76e1d07](https://github.com/edenlabllc/ehealth.web/commit/76e1d07))
* **auth:** translate validation messages in DigitalSignatureForm ([927a030](https://github.com/edenlabllc/ehealth.web/commit/927a030))
* **components:** add missing Button component export ([f15f82d](https://github.com/edenlabllc/ehealth.web/commit/f15f82d))
* **components:** add missing disabled state to InputField ([60b3459](https://github.com/edenlabllc/ehealth.web/commit/60b3459))
* downgrade jest to mach version in react-scripts ([84bcec6](https://github.com/edenlabllc/ehealth.web/commit/84bcec6))
* **utils:** ensure international format and limit phone length on parse ([9f82c6a](https://github.com/edenlabllc/ehealth.web/commit/9f82c6a))
* make all root deps regular deps ([039ce66](https://github.com/edenlabllc/ehealth.web/commit/039ce66))
* **components:** add scrolling to SelectField options list ([a3e50d6](https://github.com/edenlabllc/ehealth.web/commit/a3e50d6))
* **components:** bind SelectField dropdown focus to focused state ([ac6ee4a](https://github.com/edenlabllc/ehealth.web/commit/ac6ee4a))
* **components:** change control cursor states according HIG ([ab662d4](https://github.com/edenlabllc/ehealth.web/commit/ab662d4))
* **components:** ensure vendor validators receive string values ([a9334ae](https://github.com/edenlabllc/ehealth.web/commit/a9334ae))
* **components:** fix Button disabled state ([3180265](https://github.com/edenlabllc/ehealth.web/commit/3180265))
* **components:** force text-align to left for InputField, make InputField shrinkable, add InputField font-size theming ability ([c8e34fc](https://github.com/edenlabllc/ehealth.web/commit/c8e34fc))
* **components:** make FileField accessible ([e7d26ab](https://github.com/edenlabllc/ehealth.web/commit/e7d26ab))
* **components:** Path type prop to checkable fields ([d36d52d](https://github.com/edenlabllc/ehealth.web/commit/d36d52d))
* **components:** prevent length validation from failing when value is absent ([58b383f](https://github.com/edenlabllc/ehealth.web/commit/58b383f))


### Features

* **auth:** add client side validations to sign up flow ([b95f3c4](https://github.com/edenlabllc/ehealth.web/commit/b95f3c4)), closes [#3](https://github.com/edenlabllc/ehealth.web/issues/3)
* **auth:** add DigitalSignature provider and DigitalSignatureForm component ([03d887a](https://github.com/edenlabllc/ehealth.web/commit/03d887a))
* **auth:** add input label font-size to theme ([3ca1357](https://github.com/edenlabllc/ehealth.web/commit/3ca1357))
* **auth:** add sign up otp page ([37bb1f2](https://github.com/edenlabllc/ehealth.web/commit/37bb1f2))
* **auth:** add sign up person and user pages ([e1bc444](https://github.com/edenlabllc/ehealth.web/commit/e1bc444)), closes [#3](https://github.com/edenlabllc/ehealth.web/issues/3)
* **auth:** add sign up validate and failure pages ([ceeb406](https://github.com/edenlabllc/ehealth.web/commit/ceeb406)), closes [#3](https://github.com/edenlabllc/ehealth.web/issues/3)
* **auth:** bump React to 16.3.2 ([7c666a5](https://github.com/edenlabllc/ehealth.web/commit/7c666a5))
* **auth:** bump react-scripts to 2.0.0-next.66cc7a90 ([e9c0e8a](https://github.com/edenlabllc/ehealth.web/commit/e9c0e8a))
* **components:** add Async component ([0eee2b4](https://github.com/edenlabllc/ehealth.web/commit/0eee2b4))
* **components:** add Connect component ([8a8289e](https://github.com/edenlabllc/ehealth.web/commit/8a8289e))
* **components:** add final-form-focus decorator to Form ([c9f2650](https://github.com/edenlabllc/ehealth.web/commit/c9f2650))
* **components:** add Form buttons ([b1ef0e5](https://github.com/edenlabllc/ehealth.web/commit/b1ef0e5))
* **components:** add GroupField component, tweak checkable fields styles ([e6b391c](https://github.com/edenlabllc/ehealth.web/commit/e6b391c))
* **components:** Add horizontal appearance to input ([bde4a18](https://github.com/edenlabllc/ehealth.web/commit/bde4a18))
* **components:** add Redirect component ([1c4bb9a](https://github.com/edenlabllc/ehealth.web/commit/1c4bb9a))
* **components:** add Switch component ([c2afbc7](https://github.com/edenlabllc/ehealth.web/commit/c2afbc7))
* **components:** bump React to 16.3 ([f505414](https://github.com/edenlabllc/ehealth.web/commit/f505414))
* **icons:** Add CalendarIcon, ChevronLeftIcon, ChevromRightIcon ([109b9e1](https://github.com/edenlabllc/ehealth.web/commit/109b9e1))
* **icons:** Add InfoIcon ([3a4ff8f](https://github.com/edenlabllc/ehealth.web/commit/3a4ff8f))
* **icons:** add KeyIcon ([bc13670](https://github.com/edenlabllc/ehealth.web/commit/bc13670))
* **icons:** bump React to 16.3 ([614f89e](https://github.com/edenlabllc/ehealth.web/commit/614f89e))
* **iit-digital-signature:** add privKeySubject getter ([36a1f9b](https://github.com/edenlabllc/ehealth.web/commit/36a1f9b))
* **iit-digital-signature:** remove authority setup on init ([a2a625c](https://github.com/edenlabllc/ehealth.web/commit/a2a625c))
* **react-iit-digital-signature:** bump React to 16.3.2 ([5692408](https://github.com/edenlabllc/ehealth.web/commit/5692408))
* **react-iit-digital-signature:** deduplicate helpers, remove producer component ([0f9e4b1](https://github.com/edenlabllc/ehealth.web/commit/0f9e4b1))
* **utils:** add date format and parse functions ([80212a9](https://github.com/edenlabllc/ehealth.web/commit/80212a9))
* **utils:** add formatPhone and parsePhone functions ([95c9fe2](https://github.com/edenlabllc/ehealth.web/commit/95c9fe2))




<a name="0.5.1"></a>
## [0.5.1](https://github.com/edenlabllc/ehealth.web/compare/v0.5.0...v0.5.1) (2018-04-26)


### Bug Fixes

* **auth:** fix wrong syntax ([#33](https://github.com/edenlabllc/ehealth.web/issues/33)) ([bf981cf](https://github.com/edenlabllc/ehealth.web/commit/bf981cf))




<a name="0.5.0"></a>
# [0.5.0](https://github.com/edenlabllc/ehealth.web/compare/v0.4.0...v0.5.0) (2018-04-10)


### Features

* **iit-digital-signature:** add ability to fetch CAs list and certificates ([7e60dcd](https://github.com/edenlabllc/ehealth.web/commit/7e60dcd)), closes [#19](https://github.com/edenlabllc/ehealth.web/issues/19)
* **iit-proxy:** add ability cache requests and pass raw data ([3539943](https://github.com/edenlabllc/ehealth.web/commit/3539943))




<a name="0.4.0"></a>
# [0.4.0](https://github.com/edenlabllc/ehealth.web/compare/v0.3.4...v0.4.0) (2018-04-10)


### Bug Fixes

* **components:** mark devDependencies as regular dependencies in package-lock.json], bump internal deps versions ([b028923](https://github.com/edenlabllc/ehealth.web/commit/b028923))


### Features

* **components:** add Button component ([38b69aa](https://github.com/edenlabllc/ehealth.web/commit/38b69aa))
* **components:** add form components ([8f8f962](https://github.com/edenlabllc/ehealth.web/commit/8f8f962))
* **icons:** add CheckRight icon ([97aa8b5](https://github.com/edenlabllc/ehealth.web/commit/97aa8b5))
* **utils:** add pickProps function ([82166be](https://github.com/edenlabllc/ehealth.web/commit/82166be))
* **utils:** add switchFlags function ([6e7ea15](https://github.com/edenlabllc/ehealth.web/commit/6e7ea15))




<a name="0.3.4"></a>
## [0.3.4](https://github.com/edenlabllc/ehealth.web/compare/v0.3.3...v0.3.4) (2018-04-02)




**Note:** Version bump only for package undefined

<a name="0.3.3"></a>
## [0.3.3](https://github.com/edenlabllc/ehealth.web/compare/v0.3.2...v0.3.3) (2018-03-22)


### Bug Fixes

* **auth:** add missing links to OAuth flow pages ([#15](https://github.com/edenlabllc/ehealth.web/issues/15)) ([a6b8f7c](https://github.com/edenlabllc/ehealth.web/commit/a6b8f7c)), closes [#2](https://github.com/edenlabllc/ehealth.web/issues/2)




<a name="0.3.2"></a>
## [0.3.2](https://github.com/edenlabllc/ehealth.web/compare/v0.3.1...v0.3.2) (2018-03-21)


### Bug Fixes

* run npm start scripts in parallel ([728e5bb](https://github.com/edenlabllc/ehealth.web/commit/728e5bb))
* **auth:** render nothing until initial data loaded ([665b241](https://github.com/edenlabllc/ehealth.web/commit/665b241))




<a name="0.3.1"></a>
## [0.3.1](https://github.com/edenlabllc/ehealth.web/compare/v0.3.0...v0.3.1) (2018-03-21)


### Bug Fixes

* **auth:** enhance history with store ([3c5283d](https://github.com/edenlabllc/ehealth.web/commit/3c5283d))


### Reverts

* "chore(ci): add condition to skip building tags" ([562eb35](https://github.com/edenlabllc/ehealth.web/commit/562eb35))




<a name="0.3.0"></a>
# [0.3.0](https://github.com/edenlabllc/ehealth.web/compare/v0.2.0...v0.3.0) (2018-03-21)


### Bug Fixes

* **ci:** lock container-structure-test version, fix arguments ([5064160](https://github.com/edenlabllc/ehealth.web/commit/5064160))


### Features

* **auth:** import legacy codebase ([#1](https://github.com/edenlabllc/ehealth.web/issues/1)) ([9c00c44](https://github.com/edenlabllc/ehealth.web/commit/9c00c44))




<a name="0.2.0"></a>
# [0.2.0](https://github.com/edenlabllc/ehealth.web/compare/v0.1.0...v0.2.0) (2018-03-15)


### Bug Fixes

* **iit-proxy:** remove inspect flag from start script ([1cea2dc](https://github.com/edenlabllc/ehealth.web/commit/1cea2dc))


### Features

* **iit-digital-signature:** add ability to set settings on initialization ([276d1af](https://github.com/edenlabllc/ehealth.web/commit/276d1af))




<a name="0.1.0"></a>
# 0.1.0 (2018-03-15)


### Features

* **iit-proxy:** use streams for data transfer ([b5e2acf](https://github.com/edenlabllc/ehealth.web/commit/b5e2acf))
