var EU_MODULE_INITIALIZE_ON_LOAD = false;
var EUSignCPModuleInitialized;

// Load EUSignCP data types
var eu_wait;
//= concat ./euscpt.js
this.eu_wait = eu_wait;

// Load EUSignCP API
//= concat ./euscpm.js

// Load EUSignCP core
//= concat ./euscp.js

const initailizeModule = () =>
  new Promise((resolve, reject) => {
    EUSignCPModuleInitialized = success => (success ? resolve() : reject());
    EUSignCPModuleInitialize();
  });

module.exports = {
  __esModule: true,
  default: EUSignCP,
  initailizeModule
};
