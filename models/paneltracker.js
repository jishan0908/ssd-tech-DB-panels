const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paneltracker', {
    track_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    actions: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    venture_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    previouschangedfield: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'paneltracker',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "track_id" },
        ]
      },
    ]
  });
};
