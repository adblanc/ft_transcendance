module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ["airbnb-base", "plugin:prettier/recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        "prettier/prettier": "error",
        "global-require": "off",
        quotes: ["error", "double"],
        "import/no-unresolved": "off",
        "import/extensions": "off",
        "class-methods-use-this": "off",
        "no-undef": "off",
        camelcase: "off",
        "import/prefer-default-export": "off"
    }
};
