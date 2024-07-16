import { DataTypes } from "sequelize";
import { sequelize } from "~~/config/db";

export default sequelize.define('list', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  alias: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.INTEGER,
  },
  heartbeat_at: {
    type: DataTypes.DATE,
  },  
  last_at: {
    type: DataTypes.DATE,
  },  
  last_out_at: {
    type: DataTypes.DATE,
  },
})