/**
 * @Author: wyy
 * @Date: 2019/12/9
 * @Description: eslint
 **/
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true
    },
    parser: "babel-eslint",
    plugins: ["react", "html"],
    parserOptions: {
        "ecmaVersion": 7,
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true,
            "arrowFunctions": true,
            "classes": true,
            "modules": true,
            "defaultParams": true
        }
    },
    rules: {
        "no-console": 0,
        "no-unused-vars": 0,
        "no-unreachable": 0,
        // "no-undefined": 0
        // "react/prop-types": 0
    }
};

