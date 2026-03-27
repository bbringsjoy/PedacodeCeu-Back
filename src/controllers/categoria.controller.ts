import { Request, Response } from "express";
import Categoria from "../models/Categoria";

class CategoriasController {
  static async listarTodas(req: Request, res: Response) {
    const categorias = await Categoria.findAll();
    return res.status(200).send(categorias);
  }

  static async buscarPorId(req: Request, res: Response) {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(Number(id));

    if (categoria) {
      return res.status(200).send(categoria);
    } else {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
  }

  static async criar(req: Request, res: Response) {
    const { nome } = req.body;

    if (!nome || nome === '') {
      return res.status(400).json({ message: "Nome da categoria é obrigatório!" });
    }

    const categoria = await Categoria.create({ nome });
    return res.status(201).send(categoria);
  }

  static async atualizar(req: Request, res: Response) {
    const { id } = req.params;
    const { nome } = req.body;

    const categoria = await Categoria.findByPk(Number(id));

    if (categoria) {
      await categoria.update({ nome });
      return res.status(200).send(categoria);
    } else {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
  }

  static async remover(req: Request, res: Response) {
    const { id } = req.params;
    const categoria = await Categoria.findByPk(Number(id));

    if (categoria) {
      await categoria.destroy();
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
  }
}

export default CategoriasController;