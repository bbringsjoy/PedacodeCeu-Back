import { Request, Response } from "express";
import Produto from "../models/Produto";
import Categoria from "../models/Categoria";

class ProdutoController {
  static async findAll(req: Request, res: Response) {
    const produtos = await Produto.findAll({
      include: [{ model: Categoria, as: "categoria" }],
    });
    return res.status(200).json(produtos);
  }

  static async getById(req: Request, res: Response) {
   const id = String(req.params.id);
    const produto = await Produto.findByPk(id, {
      include: [{ model: Categoria, as: "categoria" }],
    });


    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    return res.status(200).json(produto);
  }

  static async create(req: Request, res: Response) {
    const { nome, descricao, preco, imagem, destaque, categoriaId } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    if (!descricao || descricao.trim() === "") {
      return res.status(400).json({ message: "Descrição é obrigatória" });
    }

    if (!preco || preco <= 0) {
      return res.status(400).json({ message: "Preço inválido" });
    }

    const categoria = await Categoria.findByPk(categoriaId);
    if (!categoria) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    const produto = await Produto.create({ nome, descricao, preco, imagem, destaque, categoriaId });
    return res.status(201).json(produto);
  }

  static async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const { nome, descricao, preco, imagem, destaque, ativo, categoriaId } = req.body;
    const produto = await Produto.findByPk(id);
    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    if (!nome || nome.trim() === "") {
      return res.status(400).json({ message: "Nome é obrigatório" });
    }

    if (!descricao || descricao.trim() === "") {
      return res.status(400).json({ message: "Descrição é obrigatória" });
    }

    if (!preco || preco <= 0) {
      return res.status(400).json({ message: "Preço inválido" });
    }

    await produto.update({ nome, descricao, preco, imagem, destaque, ativo, categoriaId });
    return res.status(200).json(produto);
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    const produto = await Produto.findByPk(id);

    if (!produto) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    await produto.destroy();
    return res.status(204).send();
  }
}

export default ProdutoController;