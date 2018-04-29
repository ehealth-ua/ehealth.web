const euscptSource = require("../vendor/euscpt");
const euscpmSource = require("../vendor/euscpm");
const euscpSource = require("../vendor/euscp");

var EU_MODULE_INITIALIZE_ON_LOAD = false;
var EUSignCPModuleInitialized;

// Load EUSignCP data types
var eu_wait;
eval(euscptSource);
this.eu_wait = eu_wait;

// Load EUSignCP API
eval(euscpmSource);
// Load EUSignCP core
eval(euscpSource);

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
