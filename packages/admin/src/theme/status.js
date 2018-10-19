const status = {
  bg: {
    states: {
      ACTIVE: { bg: "darkPastelGreen" },
      PROCESSED: { bg: "darkPastelGreen" },
      CLOSED: { bg: "silverCity", color: "blueberrySoda" },
      INACTIVE: { bg: "silverCity", color: "blueberrySoda" },
      REJECTED: { bg: "silverCity", color: "blueberrySoda" },
      TERMINATED: { bg: "silverCity", color: "blueberrySoda" },
      FAILED: { bg: "silverCity", color: "blueberrySoda" },
      FAILED_WITH_ERROR: { bg: "silverCity", color: "blueberrySoda" },
      PENDING_VERIFICATION: { bg: "orangePastel" },
      PENDING: { bg: "orangePastel" }
    }
  }
};

export default status;
