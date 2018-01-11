module.exports = {
  "extends": "google",
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaVersion": 6,
      "sourceType": "module"
  },
  "rules":{
      "max-len": "warn",
      "max-len/ignoreComment": "off",
      "no-invalid-this": "off",
      "new-cap": "off",
      "require-jsdoc": "off",
      "camelcase": "off"
  }
};