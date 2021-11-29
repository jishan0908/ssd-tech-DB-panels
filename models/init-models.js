var DataTypes = require("sequelize").DataTypes;
var _mypanel = require("./mypanel");
var _paneltracker = require("./paneltracker");
var _user = require("./user");

function initModels(sequelize) {
  var mypanel = _mypanel(sequelize, DataTypes);
  var paneltracker = _paneltracker(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);


  return {
    mypanel,
    paneltracker,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
