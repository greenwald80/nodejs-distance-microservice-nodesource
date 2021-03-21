"use strict";
const controller = require("./controller");

module.exports = function (app) {
  app.route("/").get(controller.home);
  app.route("/about").get(controller.about);
  app.route("/distance/:zipcode1/:zipcode2").get(controller.getDistance);
};

// http://localhost:3000/about =>
// {
//     "name": "nodesource",
//     "version": "1.0.0"
// }

// http://localhost:3000/distance/84010/97229 =>
// {
//     "distance": 638.174
// }
