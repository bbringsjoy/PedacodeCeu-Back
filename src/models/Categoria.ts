import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Categoria extends Model {
  public id!: string;
  public nome!: string;
}

Categoria.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "categorias",
    timestamps: false,
  }
);

export default Categoria;