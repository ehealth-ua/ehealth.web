import colors from "./colors";

const buttonColors = {
  light: [
    ["#F2F4F7", "#FFFFFF"],
    ["#EAEEF3", "#FFFFFF"],
    ["#E0E4E8", "#F2F7FA"],
    ["#EAEEF3", "#FFFFFF"]
  ],
  lightBorder: ["#CED0DA", "#CED0DA", "#CED0DA", "#CED0DA"],

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

const btnStylesCreator = (name, fontColor = colors.white) => ({
  backgroundImage: `linear-gradient(0deg, ${buttonColors[name][0][0]} 0%, ${
    buttonColors[name][0][1]
  } 100%)`,
  borderColor: buttonColors[name + "Border"][0],
  color: fontColor,
  "&:hover": {
    backgroundImage: `linear-gradient(0deg, ${buttonColors[name][1][0]} 0%, ${
      buttonColors[name][1][1]
    } 100%)`,
    borderColor: buttonColors[name + "Border"][1]
  },
  "&:active": {
    backgroundImage: `linear-gradient(0deg, ${buttonColors[name][2][0]} 0%, ${
      buttonColors[name][2][1]
    } 100%)`,
    borderColor: buttonColors[name + "Border"][2]
  },
  "&:disabled": {
    backgroundImage: "none",
    backgroundColor: "#E9EDF1",
    borderColor: "#DFE3E9",
    color: "rgba(53, 82, 62, 0.5)"
  }
});

const buttons = {
  light: btnStylesCreator("light", colors.darkAndStormy),
  green: btnStylesCreator("green"),
  blue: btnStylesCreator("blue"),
  purple: btnStylesCreator("purple"),
  red: btnStylesCreator("red"),
  carbon: btnStylesCreator("carbon"),
  orange: btnStylesCreator("orange")
};

export default buttons;
