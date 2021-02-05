const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");
const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
const path = require("path");
const { domain } = require("process");
module.exports = withPlugins([[withSass], [withImages], [withCSS]], {
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  },
  env: {
    baseUrl:'http://localhost:3000',
    AWS_ACCESS_KEY_ID: "AKIASQKGQTBO4I5MWPOU",
    AWS_SECRET_ACCESS_KEY: "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",
    AWS_REGION: "us-east-1",
    BUCKET_NAME: "whipflipnow",
   
  },
  images: {
    domains: ['whipflipnow.s3.amazonaws.com'] 
  },
 
});


