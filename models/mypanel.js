const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mypanel', {
    SL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    IP_DB: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    NAS_DRIVE: {
      type: DataTypes.ENUM('yes','no','pending'),
      allowNull: true
    },
    Replication: {
      type: DataTypes.ENUM('yes','no','pending'),
      allowNull: true
    },
    Monitoring_Panel: {
      type: DataTypes.ENUM('yes','no','pending'),
      allowNull: true
    },
    Remote_root_disable: {
      type: DataTypes.ENUM('yes','no','pending'),
      allowNull: true
    },
    Point_In_Time_Recovery: {
      type: DataTypes.ENUM('Yes','No','Pending','Permission Denied'),
      allowNull: true
    },
    Mysql_Config_Backup: {
      type: DataTypes.ENUM('yes','no','pending'),
      allowNull: true
    },
    DB_BACKUP: {
      type: DataTypes.ENUM('yes','no','pending'),
      allowNull: true
    },
    User_Previleges: {
      type: DataTypes.ENUM('yes','no','pending'),
      allowNull: true
    },
    Primary_Backup_Location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Secondary_Backup_Location: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Audit_Log: {
      type: DataTypes.ENUM('yes','no','pending','no(disk space issue)'),
      allowNull: true
    },
    Audit_Log_File: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Remarks: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    IP_DB_private: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Service_Restoration_Time: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Important_DB: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Server_SSH: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Backup_type: {
      type: DataTypes.ENUM('Database specific backup','Full Backup','No Backup'),
      allowNull: true
    },
    last_backup_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "0000-00-00 00:00:00"
    },
    backup_failed_reason: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    backup_status: {
      type: DataTypes.ENUM('Success','Failed'),
      allowNull: true
    },
    CONFIG_FILE_NAME: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    SCHEMA_FILE_NAME: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    SCHEMA_FILE_LOCATION: {
      type: DataTypes.VIRTUAL
    }
  }, {
    sequelize,
    tableName: 'mypanel',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SL" },
        ]
      },
    ]
  });
};
