const inputs = {
  border: {
    states: {
      default: { borderColor: "silverCity" },
      active: { borderColor: "rockmanBlue" },
      errored: { borderColor: "redPigment", color: "redPigment" },
      success: { borderColor: "darkPastelGreen" },
      disabled: { bg: "wallsOfSantorini" }
    }
  },
  field: {
    select: {
      pointerEvents: "none",
      backgroundImage: "linear-gradient(0deg, #F2F4F7 0%, #FFFFFF 100%)"
    },
    disabled: {
      pointerEvents: "none",
      bg: "#E9EDF1"
    }
  },
  divider: {
    active: {
      pr: 2,
      borderStyle: "solid",
      borderWidth: "0 1px 0 0",
      borderColor: "januaryDawn"
    }
  },
  button: {
    select: {
      width: "100%",
      textAlign: "right"
    }
  },
  select: {
    visible: {
      visibility: "visible"
    }
  }
};

export default inputs;
