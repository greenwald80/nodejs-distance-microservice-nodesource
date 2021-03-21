"use strict";
const properties = require("../package.json");
const distance = require("../service/distance");

const controllers = {
  home: function (req, res) {
    const aboutInfo = {
      about: "http://localhost:3000/about",
      distance: "http://localhost:3000/distance/84010/97229",
    };
    res.json(aboutInfo);
  },
  about: function (req, res) {
    const aboutInfo = {
      name: properties.name,
      version: properties.version,
    };
    res.json(aboutInfo);
  },
  getDistance: function (req, res) {
    distance.find(req, res, function (err, dist) {
      if (err) res.send(err);
      res.json(dist);
    });
  },
};

module.exports = controllers;
