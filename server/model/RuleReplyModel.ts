import { DataTypes } from "sequelize";
import { sequelize } from "~~/config/db";

export default sequelize.define('rule_reply', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chat_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  chat_type: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  keyword: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reply_type: {
    type: DataTypes.INTEGER,
  },
  reply_content: {
    type: DataTypes.STRING,
  },
  used_num: {
    type: DataTypes.INTEGER,
  }
})