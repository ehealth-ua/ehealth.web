import colors from "./colors";

const btnStylesCreator = (name, fontColor = colors.white) => ({
  backgroundImage: `linear-gradient(0deg, ${colors[name][0][0]} 0%, ${
    colors[name][0][1]
  } 100%)`,
  borderColor: colors[name + "Border"][0],
  color: fontColor,
  "&:hover": {
    backgroundImage: `linear-gradient(0deg, ${colors[name][1][0]} 0%, ${
      colors[name][1][1]
    } 100%)`,
    borderColor: colors[name + "Border"][1]
  },
  "&:active": {
    backgroundImage: `linear-gradient(0deg, ${colors[name][2][0]} 0%, ${
      colors[name][2][1]
    } 100%)`,
    borderColor: colors[name + "Border"][2]
  },
  "&:disabled": {
    backgroundImage: "none",
    backgroundColor: "#E9EDF1",
    borderColor: "#DFE3E9",
    color: colors.font.carbon50
  }
});

const buttons = {
  light: btnStylesCreator("light", colors.carbon),
  green: btnStylesCreator("green"),
  blue: btnStylesCreator("blue"),
  purple: btnStylesCreator("purple"),
  red: btnStylesCreator("red"),
  carbon: btnStylesCreator("carbon"),
  orange: btnStylesCreator("orange")
};

export default buttons;
