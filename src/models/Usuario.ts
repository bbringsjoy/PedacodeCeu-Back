import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Usuario extends Model {
  public id!: string;
  public nome!: string;
  public email!: string;
  public senha!: string;
  public cpf!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Usuario.init(
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "usuarios",
  }
);

export default Usuario;