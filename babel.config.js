// babel.config.js
module.exports = {
    "presets": [
        "module:metro-react-native-babel-preset",
    ],
    "plugins": [
        ["module-resolver", {
            "root": ["./src"],
            "extensions": [".js", ".ts", ".tsx", ".ios.js", ".android.js"]
        }],
        "@babel/plugin-transform-runtime",
        ["@babel/plugin-proposal-decorators", { "legacy": true }]
    ],
    "env": {
        "production": {
            "plugins": ["transform-remove-console"]
        },
    }
};
