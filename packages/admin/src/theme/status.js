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
      REORGANIZED: { bg: "orangePastel", color: "blueberrySoda" },
      PENDING_VERIFICATION: { bg: "orangePastel" },
      PENDING: { bg: "orangePastel" },
      NEW: { bg: "bluePastel" },
      IN_PROCESS: { bg: "orangePastel" },
      POSTPONE: { bg: "orangePastel" },
      DECLINED: { bg: "redPigment" },
      DISMISSED: { bg: "redPigment" },
      EXPIRED: { bg: "redPigment" },
      ABORTED: { bg: "redPigment" },
      SUSPENDED: { bg: "redPigment" },
      APPROVED: { bg: "darkPastelGreen" },
      PENDING_NHS_SIGN: { bg: "shiningKnight", fontSize: 8 },
      SIGNED: { bg: "darkPastelGreen" },
      VERIFIED: { bg: "darkPastelGreen" },
      NHS_SIGNED: { bg: "darkAndStormy" },
      [true]: { bg: "redPigment" },
      [false]: { bg: "darkPastelGreen" }
    }
  }
};

export default status;
