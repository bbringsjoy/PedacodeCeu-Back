import { Request, Response } from "express";
import Categoria from "../models/Categoria";

class CategoriaController {
  static async findAll(req: Request, res: Response) {
    const categorias = await Categoria.findAll();
    return res.status(200).json(categorias);
  }

  static async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const categoria = await Categoria.findByPk(id); 

    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    return res.status(200).json(categoria);
  }

  static async create(req: Request, res: Response) {
    const { nome } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    const categoria = await Categoria.create({ nome });
    return res.status(201).json(categoria);
  }

  static async update(req: Request, res: Response) {
   const id = String(req.params.id);
    const { nome } = req.body;
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    await categoria.update({ nome });
    return res.status(200).json(categoria);
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    await categoria.destroy();
    return res.status(204).send();
  }
}

export default CategoriaController;