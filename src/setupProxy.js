// @ts-ignoretypescript

const proxy = require("http-proxy-middleware");

const env = {
    test: "http://127.0.0.1:8080",
    production: "http://127.0.0.1:8080"
}

module.exports = function(app) {
    app.use(
        proxy('/api', {
            target: env.production,
            pathRewrite: {
                "^/api": ""
            }
        }
    ))
  }
