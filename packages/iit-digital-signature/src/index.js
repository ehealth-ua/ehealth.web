require("whatwg-fetch");
const fromPairs = require("lodash/fromPairs");

const euscptSource = require("../vendor/euscpt");
const euscpmSource = require("../vendor/euscpm");
const euscpSource = require("../vendor/euscp");

const IIT_CA_CERTS_URL =
  "https://iit.com.ua/download/productfiles/CACertificates.p7b";
const IIT_CAS_URL = "https://iit.com.ua/download/productfiles/CAs.json";
const DEVELOPMENT_PROXY = "http://localhost:5000/";

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

class DigitalSignature extends EUSignCP {
  static async initialize(settings = {}) {
    await initailizeModule();

    const { proxy = DEVELOPMENT_PROXY } = settings;

    const certificates = await fetchCertificates(proxy);
    const authorities = await fetchAuthorities(proxy);

    return new DigitalSignature({ certificates, authorities, proxy, settings });
  }

  constructor({ certificates, authorities, proxy, settings }) {
    super();

    this.authorities = authorities;
    this.settings = settings;

    this.setup();
    this.SetXMLHTTPProxyService(proxy);
    this.SaveCertificates(certificates);
    this.setOcspAccessInfo();
  }

  setup() {
    const {
      fileStoreSettings,
      proxySettings,
      tspSettings,
      ocspSettings,
      cmpSettings,
      ldapSettings,
      ocspAccessInfoModeSettings
    } = this.settings;

    this.SetFileStoreSettings(
      Object.assign(this.CreateFileStoreSettings(), fileStoreSettings)
    );

    this.SetProxySettings(
      Object.assign(this.CreateProxySettings(), proxySettings)
    );

    this.SetTSPSettings(Object.assign(this.CreateTSPSettings(), tspSettings));

    this.SetOCSPSettings(
      Object.assign(this.CreateOCSPSettings(), ocspSettings)
    );

    this.SetCMPSettings(Object.assign(this.CreateCMPSettings(), cmpSettings));

    this.SetLDAPSettings(
      Object.assign(this.CreateLDAPSettings(), ldapSettings)
    );

    if (ocspAccessInfoModeSettings) {
      this.SetOCSPAccessInfoModeSettings(
        Object.assign(
          this.CreateOCSPAccessInfoModeSettings(),
          ocspAccessInfoModeSettings
        )
      );
    }
  }

  setOcspAccessInfo() {
    this.authorities.forEach(
      ({ issuerCNs, ocspAccessPointAddress, ocspAccessPointPort }) =>
        issuerCNs.forEach(issuerCN => {
          const settings = this.CreateOCSPAccessInfoSettings();
          settings.SetAddress(ocspAccessPointAddress);
          settings.SetPort(ocspAccessPointPort);
          settings.SetIssuerCN(issuerCN);
          this.SetOCSPAccessInfoSettings(settings);
        })
    );
  }

  setAuthority(index) {
    if (index >= this.authorities.length) {
      throw new Error("Wrong authority index");
    }

    const { cmpAddress, tspAddress } = this.authorities[index];

    const cmpSettings = this.CreateCMPSettings();
    cmpSettings.SetUseCMP(true);
    cmpSettings.SetAddress(cmpAddress);
    this.SetCMPSettings(cmpSettings);

    const tspSettings = this.CreateTSPSettings();
    tspSettings.SetGetStamps(true);
    tspSettings.SetAddress(tspAddress);
    this.SetTSPSettings(tspSettings);
  }

  get privKeySubject() {
    if (!this.privKeyOwnerInfo) return null;

    const subjectEntries = this.privKeyOwnerInfo.subject
      .split(";")
      .map(entryString => entryString.split("="));

    return fromPairs(subjectEntries);
  }
}

const initailizeModule = () =>
  new Promise((resolve, reject) => {
    EUSignCPModuleInitialized = success => (success ? resolve() : reject());
    EUSignCPModuleInitialize();
  });

const fetchCertificates = async proxy => {
  const response = await fetch(
    `${proxy}?raw=true&cache=true&address=${IIT_CA_CERTS_URL}`
  );
  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
};

const fetchAuthorities = async proxy => {
  const authoritiesResponse = await fetch(
    `${proxy}?raw=true&cache=true&address=${IIT_CAS_URL}`
  );
  return authoritiesResponse.json();
};

module.exports = {
  __esModule: true,
  default: DigitalSignature
};
