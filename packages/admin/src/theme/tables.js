const tables = {
  horizontal: {
    py: 2,
    bg: "white",
    "&:first-of-type": {
      fontWeight: "bold",
      backgroundColor: "#fafbfc",
      width: "30%",
      "&:first-letter": {
        textTransform: "uppercase"
      }
    }
  },
  mismatch: {
    color: "redPigment"
  }
};

export default tables;
