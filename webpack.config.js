const path = require("path");

module.exports = {
  entry: "./index.mjs",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bluebird-api.mjs"
  },
};
