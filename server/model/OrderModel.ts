import { DataTypes } from "sequelize";
import { sequelize } from "~~/config/db";

export default sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bot_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  msg_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uid: {
    type: DataTypes.STRING,
  },
  user_name: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.STRING,
  },
  result: {
    type: DataTypes.STRING,
  },
  time: {
    type: DataTypes.DATE,
  },
  status: {
    type: DataTypes.INTEGER,
  }
})