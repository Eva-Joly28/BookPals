module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "root": true,
  "extends": ["standard"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "unused-imports"],
  "rules": {
    "semi": "off",
    "no-console": "error",
    "no-unused-vars": "off",
    "no-return-assign": "off",
    "no-redeclare": "off",
    "no-use-before-define":"off", 
    "no-useless-constructor":"off", 
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-redeclare": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "unused-imports/no-unused-imports": "error",
    "max-statements": ["error", { "max": 15 }],
    "unused-imports/no-unused-vars": [
      "warn",
      {
        "vars": "all",
        "varsIgnorePattern": "^_",
        "args": "after-used",
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "comma", // 'none' or 'semi' or 'comma'
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi", // 'semi' or 'comma'
          "requireLast": false
        }
      }
    ],
    "@typescript-eslint/member-ordering": "warn"
  }
}
