module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  plugins: [
    "react",
    "prettier"
  ],
  parser: "babel-eslint",
  env: {
    browser: true,
    commonjs: true,
  },
  root: true,
  rules: {
    "prettier/prettier": ["error", {
      useTabs: false,
      // Fit code within this line limit
      printWidth: 80,
      // Number of spaces it should use per tab
      tabWidth: 2,
      // If true, will use single instead of double quotes
      singleQuote: false,

      // Controls the printing of trailing commas wherever possible. Valid options:
      // "none" - No trailing commas
      // "es5"  - Trailing commas where valid in ES5 (objects, arrays, etc)
      // "all"  - Trailing commas wherever possible (function arguments)
      //
      // NOTE: Above is only available in 0.19.0 and above. Previously this was
      // a boolean argument.
      trailingComma: "none",

      // Controls the printing of spaces inside object literals
      bracketSpacing: true,

      // If true, puts the `>` of a multi-line jsx element at the end of
      // the last line instead of being alone on the next line
      jsxBracketSameLine: false,

      // Which parser to use. Valid options are "flow" and "babylon"
      parser: "babylon",

      // Whether to add a semicolon at the end of every line (semi: true),
      // or only at the beginning of lines that may introduce ASI failures (semi: false)
      semi: true
    }],
    "react/react-in-jsx-scope": 0,
    "no-console": 0
  },
  globals: {
    React: true,
    ENV: true,
    process:true,
    __dirname:true,
  },
};
