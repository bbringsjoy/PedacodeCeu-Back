import { Request, Response } from "express";
import Product from "../models/Produtos";
import Category from "../models/Categoria";

class ProductsController {
  static async findAll(req: Request, res: Response) {
    const products = await Product.findAll({
      include: [{ model: Category, as: "category" }]
    });

    res.send(products);
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const product = await Product.findByPk(Number(id));

    return res.status(200).send(product);
  }

  static async create(req: Request, res: Response) {
    const { name } = req.body;

    if (!name || name == '') {
      return res.status(400).json({ message: 'Nome do produto é obrigatório!' });
    }

    const product = await Product.create({ name });
    return res.status(200).send(product);
  }

  static async remove(req: Request, res: Response) {
    const { id } = req.params;
    const product = await Product.findByPk(Number(id));

    if (product) {
      await product.destroy();
    } else {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(204).send();
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;

    const product = await Product.findByPk(Number(id));

    if (product) {
      await product.update({
        name
      });

      return res.status(200).send(product);
    } else {
      return res.status(404).json({ message: "Produto não encontrado" });
    }
  }
}

export default ProductsController;