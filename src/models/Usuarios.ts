import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Usuarios extends Model {
  public id!: number;
  public name!: string;
}

Usuarios.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Users",
  },
);

export default Usuarios;