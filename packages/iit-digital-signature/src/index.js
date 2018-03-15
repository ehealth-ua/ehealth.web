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

const initialize = settings =>
  new Promise((resolve, reject) => {
    EUSignCPModuleInitialized = success => {
      if (!success) reject();

      const instance = new EUSignCP();
      setup(instance, settings);

      resolve(instance);
    };

    EUSignCPModuleInitialize();
  });

const setup = (instance, settings = {}) => {
  const {
    proxy = "http://localhost:5000/",
    fileStoreSettings,
    proxySettings,
    tspSettings,
    ocspSettings,
    cmpSettings,
    ldapSettings,
    ocspAccessInfoModeSettings
  } = settings;

  instance.SetXMLHTTPProxyService(proxy);

  instance.SetFileStoreSettings(
    Object.assign(instance.CreateFileStoreSettings(), fileStoreSettings)
  );

  instance.SetProxySettings(
    Object.assign(instance.CreateProxySettings(), proxySettings)
  );

  instance.SetTSPSettings(
    Object.assign(instance.CreateTSPSettings(), tspSettings)
  );

  instance.SetOCSPSettings(
    Object.assign(instance.CreateOCSPSettings(), ocspSettings)
  );

  instance.SetCMPSettings(
    Object.assign(instance.CreateCMPSettings(), cmpSettings)
  );

  instance.SetLDAPSettings(
    Object.assign(instance.CreateLDAPSettings(), ldapSettings)
  );

  if (ocspAccessInfoModeSettings) {
    instance.SetOCSPAccessInfoModeSettings(
      Object.assign(
        instance.CreateOCSPAccessInfoModeSettings(),
        ocspAccessInfoModeSettings
      )
    );
  }
};

module.exports = {
  __esModule: true,
  default: EUSignCP,
  initialize
};
