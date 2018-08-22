const colors = {
  black: "#000",
  white: "#fff",

  disabled: "#E9EDF1",
  disabledBorder: "#DFE3E9",
  font: {
    red: "#ED1C24",
    blue: "#2EA2F8",
    carbon: "#354052",
    green: "#1BB934"
  },
  gray: "#DFE1E5",
  darken: "#C2CAD4",

  light: [
    ["#F2F4F7", "#FFFFFF"],
    ["#EAEEF3", "#FFFFFF"],
    ["#E0E4E8", "#F2F7FA"],
    ["#EAEEF3", "#FFFFFF"]
  ],
  lightBorder: "#CED0DA",

  green: [
    ["#39B54A", "#34AA44"],
    ["#1E930B", "#1E9D09"],
    ["#1A740B", "#187A08"],
    ["#1E930B", "#1E9D09"]
  ],
  greenBorder: ["#249533", "#1F872D", "#14661F", "#249533"],

  blue: [
    ["#1991EB", "#2DA1F8"],
    ["#1584D7", "#2184CF"],
    ["#0C73C1", "#196BAA"],
    ["#1584D7", "#2184CF"]
  ],
  blueBorder: ["#1585D8", "#1578C2", "#1468A7", "#1578C2"],

  purple: [
    ["#6B47DB", "#8261E6"],
    ["#613CD0", "#7352D5"],
    ["#5632C4", "#714EDC"],
    ["#613CD0", "#7352D5"]
  ],
  purpleBorder: ["#5F40C1", "#5739B8", "#5536B6", "#5F40C1"],
  red: [
    ["#F85359", "#DC151D"],
    ["#F14D53", "#D0161D"],
    ["#EC4349", "#BD0C13"],
    ["#F14D53", "#D0161D"]
  ],
  redBorder: ["#DB161E", "#D0121A", "#D01119", "#D0121A"],
  carbon: [
    ["#516173", "#3B4857"],
    ["#415061", "#303D4C"],
    ["#354353", "#242F3B"],
    ["#415061", "#303D4C"]
  ],
  carbonBorder: ["#3B4958", "#334050", "#303C4B", "#334050"],
  orange: [
    ["#F7981C", "#F76B1C"],
    ["#EF9219", "#E86013"],
    ["#E88B12", "#E75908"],
    ["#EF9219", "#E86013"]
  ],
  orangeBorder: ["#F36A19", "#EA6211", "#E25D0E", "#EA6211"]
};

const theme = {
  ...colors,

  buttonStyles: {
    light: {
      backgroundImage: `linear-gradient(0deg, ${colors.light[0][0]} 0%, ${
        colors.light[0][1]
      } 100%)`,
      borderColor: "#CED0DA",
      color: "#354052",
      "&:hover": {
        backgroundImage: `linear-gradient(0deg, ${colors.light[0][0]} 0%, ${
          colors.light[0][1]
        } 100%)`
      },
      "&:active": {
        backgroundImage: `linear-gradient(0deg, ${colors.light[0][0]} 0%, ${
          colors.light[0][1]
        } 100%)`
      },
      "&:disabled": {
        backgroundImage: "none",
        backgroundColor: "#E9EDF1",
        borderColor: "#E9EDF1"
      }
    },
    green: {
      backgroundImage: `linear-gradient(0deg, ${colors.green[0][0]} 0%, ${
        colors.green[0][1]
      } 100%)`,
      borderColor: colors.greenBorder[0],
      color: "#FFF",
      "&:hover": {
        backgroundImage: `linear-gradient(0deg, ${colors.green[0][0]} 0%, ${
          colors.green[0][1]
        } 100%)`,
        borderColor: colors.greenBorder[1]
      },
      "&:active": {
        backgroundImage: `linear-gradient(0deg, ${colors.green[0][0]} 0%, ${
          colors.green[0][1]
        } 100%)`,
        borderColor: colors.greenBorder[2]
      }
    },
    blue: {
      backgroundImage: `linear-gradient(0deg, ${colors.blue[0][0]} 0%, ${
        colors.blue[0][1]
      } 100%)`,
      borderColor: colors.blueBorder[0],
      color: "#FFF",
      "&:hover": {
        backgroundImage: `linear-gradient(0deg, ${colors.blue[0][0]} 0%, ${
          colors.blue[0][1]
        } 100%)`,
        borderColor: colors.blueBorder[1]
      },
      "&:active": {
        backgroundImage: `linear-gradient(0deg, ${colors.blue[0][0]} 0%, ${
          colors.blue[0][1]
        } 100%)`,
        borderColor: colors.blueBorder[2]
      }
    },
    purple: {
      backgroundImage: `linear-gradient(0deg, ${colors.purple[0][0]} 0%, ${
        colors.purple[0][1]
      } 100%)`,
      borderColor: colors.purpleBorder[0],
      color: "#FFF",
      "&:hover": {
        backgroundImage: `linear-gradient(0deg, ${colors.purple[0][0]} 0%, ${
          colors.purple[0][1]
        } 100%)`,
        borderColor: colors.purpleBorder[1]
      },
      "&:active": {
        backgroundImage: `linear-gradient(0deg, ${colors.purple[0][0]} 0%, ${
          colors.purple[0][1]
        } 100%)`,
        borderColor: colors.purpleBorder[2]
      }
    },
    red: {
      backgroundImage: `linear-gradient(0deg, ${colors.red[0][0]} 0%, ${
        colors.red[0][1]
      } 100%)`,
      borderColor: colors.redBorder[0],
      color: "#FFF",
      "&:hover": {
        backgroundImage: `linear-gradient(0deg, ${colors.red[0][0]} 0%, ${
          colors.red[0][1]
        } 100%)`,
        borderColor: colors.redBorder[1]
      },
      "&:active": {
        backgroundImage: `linear-gradient(0deg, ${colors.red[0][0]} 0%, ${
          colors.red[0][1]
        } 100%)`,
        borderColor: colors.redBorder[2]
      }
    },
    carbon: {
      backgroundImage: `linear-gradient(0deg, ${colors.carbon[0][0]} 0%, ${
        colors.carbon[0][1]
      } 100%)`,
      borderColor: colors.carbonBorder[0],
      color: "#FFF",
      "&:hover": {
        backgroundImage: `linear-gradient(0deg, ${colors.carbon[1][0]} 0%, ${
          colors.carbon[1][1]
        } 100%)`,
        borderColor: colors.carbonBorder[1]
      },
      "&:active": {
        backgroundImage: `linear-gradient(0deg, ${colors.carbon[2][0]} 0%, ${
          colors.carbon[2][1]
        } 100%)`,
        borderColor: colors.carbonBorder[2]
      }
    },
    orange: {
      backgroundImage: `linear-gradient(0deg, ${colors.orange[0][0]} 0%, ${
        colors.orange[0][1]
      } 100%)`,
      borderColor: colors.orangeBorder[0],
      color: "#FFF",
      "&:hover": {
        backgroundImage: `linear-gradient(0deg, ${colors.orange[1][0]} 0%, ${
          colors.orange[1][1]
        } 100%)`,
        borderColor: colors.orangeBorder[1]
      },
      "&:active": {
        backgroundImage: `linear-gradient(0deg, ${colors.orange[2][0]} 0%, ${
          colors.orange[2][1]
        } 100%)`,
        borderColor: colors.orangeBorder[2]
      }
    }
  }
};

export default theme;
