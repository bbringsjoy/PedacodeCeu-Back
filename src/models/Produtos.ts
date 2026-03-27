import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Category from "./Categoria";
import Categoria from "./Categoria";

class Produtos extends Model {
  public id!: number;
  public name!: string;
}

Produtos.init(
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
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categories",
        key: "id"
      }
    },
  },
  {
    sequelize,
    tableName: "Products",
  },
);

Categoria.hasMany(Produtos, {
  foreignKey: "categoryId",
  as: "products"
});

Produtos.belongsTo(Categoria, {
  foreignKey: "categoryId",
  as: "category"
});

export default Produtos;