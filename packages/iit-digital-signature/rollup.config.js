import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import concat from "rollup-plugin-concat";
import uglify from "rollup-plugin-uglify";

export default {
  input: "src/index.js",
  plugins: [
    resolve(),
    commonjs(),
    babel({ exclude: "node_modules/**" }),
    concat(),
    uglify()
  ],
  output: [
    {
      file: "dist/cjs/iit-digital-signature.min.js",
      format: "cjs",
      strict: false
    },
    {
      file: "dist/umd/iit-digital-signature.min.js",
      format: "umd",
      strict: false,
      name: "DigitalSignature"
    }
  ],
  onwarn(warning, warn) {
    // Suppress vendor code warnings
    if (warning.loc && /(node_modules|vendor)/.test(warning.loc.file)) return;
    warn(warning);
  }
};
