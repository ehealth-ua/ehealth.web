const inputs = {
  border: {
    states: {
      active: { borderColor: "rockmanBlue" },
      errored: { borderColor: "redPigment", color: "redPigment" },
      success: { borderColor: "darkPastelGreen" },
      disabled: { bg: "wallsOfSantorini" }
    }
  },
  field: {
    select: {
      pointerEvents: "none",
      backgroundImage: `linear-gradient(0deg, #F2F4F7 0%, #FFFFFF 100%)`
    },
    disabled: {
      pointerEvents: "none",
      bg: "#E9EDF1"
    }
  },
  button: {
    disabled: {
      pointerEvents: "none"
    }
  }
};

export default inputs;
