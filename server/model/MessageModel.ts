import { DataTypes } from "sequelize";
import { sequelize } from "~~/config/db";

export default sequelize.define('message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  bot_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  talker_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  talker_name: {
    type: DataTypes.STRING,
  },
  talker_avatar: {
    type: DataTypes.STRING,
  },
  talker_gender: {
    type: DataTypes.INTEGER,
  },
  talker_alias: {
    type: DataTypes.STRING,
  },
  listener_id: {
    type: DataTypes.STRING,
  },
  listener_name: {
    type: DataTypes.STRING,
  },
  listener_avatar: {
    type: DataTypes.STRING,
  },
  listener_gender: {
    type: DataTypes.INTEGER,
  },
  listener_alias: {
    type: DataTypes.STRING,
  },
  room_id: {
    type: DataTypes.STRING,
  },
  room_name: {
    type: DataTypes.STRING,
  },
  room_avatar: {
    type: DataTypes.STRING,
  },
  message_id: {
    type: DataTypes.STRING,
  },
  message_type: {
    type: DataTypes.INTEGER,
  },
  message_content: {
    type: DataTypes.STRING,
  },
  message_at: {
    type: DataTypes.DATE,
  }
})