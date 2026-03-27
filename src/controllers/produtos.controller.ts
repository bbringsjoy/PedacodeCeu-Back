import { Request, Response } from 'express'
import Produto from '../models/Produto'
import Categoria from '../models/Categoria'
import { parsePagination } from '../utils/validations'
import { ProdutoCreate, ProdutoUpdate } from '../types'

class ProdutoController {
  static async findAll(req: Request, res: Response) {
    const { page, limit } = req.query as { page?: string; limit?: string }
    const { skip, take } = parsePagination(page, limit)

    const { rows: produtos, count: total } = await Produto.findAndCountAll({
      offset: skip,
      limit: take,
      include: [{ model: Categoria, as: 'categoria' }]
    })

    return res.status(200).json({ data: produtos, total, page: Number(page || 1), limit: take })
  }

  static async getById(req: Request, res: Response) {
    const id = String(req.params.id)

    const produto = await Produto.findByPk(id, {
      include: [{ model: Categoria, as: 'categoria' }]
    })

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' })
    }

    return res.status(200).json(produto)
  }

  static async create(req: Request, res: Response) {
    const { nome, descricao, preco, imagem, destaque, categoriaId }: ProdutoCreate = req.body

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: 'Nome é obrigatório' })
    }

    if (!descricao || descricao.trim() === '') {
      return res.status(400).json({ message: 'Descrição é obrigatória' })
    }

    if (!preco || preco <= 0) {
      return res.status(400).json({ message: 'Preço inválido' })
    }

    if (!categoriaId || categoriaId.trim() === '') {
      return res.status(400).json({ message: 'Categoria é obrigatória' })
    }

    const categoria = await Categoria.findByPk(categoriaId)

    if (!categoria) {
      return res.status(404).json({ message: 'Categoria não encontrada' })
    }

    const produto = await Produto.create({ nome, descricao, preco, imagem, destaque, categoriaId })

    return res.status(201).json(produto)
  }

  static async update(req: Request, res: Response) {
    const id = String(req.params.id)
    const { nome, descricao, preco, imagem, destaque, ativo, categoriaId }: ProdutoUpdate = req.body

    const produto = await Produto.findByPk(id)

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' })
    }

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: 'Nome é obrigatório' })
    }

    if (!descricao || descricao.trim() === '') {
      return res.status(400).json({ message: 'Descrição é obrigatória' })
    }

    if (!preco || preco <= 0) {
      return res.status(400).json({ message: 'Preço inválido' })
    }

    await produto.update({ nome, descricao, preco, imagem, destaque, ativo, categoriaId })

    return res.status(200).json(produto)
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id)

    const produto = await Produto.findByPk(id)

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' })
    }

    await produto.destroy()

    return res.status(204).send()
  }
}

export default ProdutoController
