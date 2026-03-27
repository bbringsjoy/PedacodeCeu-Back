import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Categoria extends Model {
  public id!: number;
  public nome!: string;
}

Categoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    tableName: "Categorias",
  },
);

export default Categoria;