import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario'
import { validarEmail, validarCPF, validarSenha, parsePagination } from '../utils/validations'
import { AuthRequest } from '../middlewares/auth.middleware'
import { UsuarioCreate, UsuarioUpdate } from '../types'

class UsuarioController {
  static async findAll(req: Request, res: Response) {
    const { page, limit } = req.query as { page?: string; limit?: string }
    const { skip, take } = parsePagination(page, limit)

    const { rows: usuarios, count: total } = await Usuario.findAndCountAll({
      offset: skip,
      limit: take,
      attributes: ['id', 'nome', 'email', 'cpf', 'createdAt']
    })

    return res.status(200).json({ data: usuarios, total, page: Number(page || 1), limit: take })
  }

  static async getById(req: Request, res: Response) {
    const id = String(req.params.id)

    const usuario = await Usuario.findByPk(id, {
      attributes: ['id', 'nome', 'email', 'cpf', 'createdAt']
    })

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    return res.status(200).json(usuario)
  }

  static async create(req: Request, res: Response) {
    const { nome, email, senha, cpf }: UsuarioCreate = req.body

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: 'Nome é obrigatório' })
    }

    if (!email || !validarEmail(email)) {
      return res.status(400).json({ message: 'E-mail inválido' })
    }

    if (!senha || !validarSenha(senha)) {
      return res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial' })
    }

    if (!cpf || !validarCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' })
    }

    const emailExiste = await Usuario.findOne({ where: { email } })
    if (emailExiste) {
      return res.status(400).json({ message: 'E-mail já cadastrado' })
    }

    const cpfExiste = await Usuario.findOne({ where: { cpf } })
    if (cpfExiste) {
      return res.status(400).json({ message: 'CPF já cadastrado' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const usuario = await Usuario.create({ nome, email, senha: senhaCriptografada, cpf })

    return res.status(201).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      createdAt: usuario.createdAt
    })
  }

  static async update(req: AuthRequest, res: Response) {
    const id = String(req.params.id)
    const { nome, senha, cpf }: UsuarioUpdate = req.body

    if (req.usuario?.id !== id) {
      return res.status(403).json({ message: 'Você não tem permissão para editar este usuário' })
    }

    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ message: 'Nome é obrigatório' })
    }

    if (!senha || !validarSenha(senha)) {
      return res.status(400).json({ message: 'A senha deve ter no mínimo 8 caracteres, letra maiúscula, minúscula, número e caractere especial' })
    }

    if (!cpf || !validarCPF(cpf)) {
      return res.status(400).json({ message: 'CPF inválido' })
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    await usuario.update({ nome, senha: senhaCriptografada, cpf })

    return res.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      updatedAt: usuario.updatedAt
    })
  }

  static async remove(req: Request, res: Response) {
    const id = String(req.params.id)

    const usuario = await Usuario.findByPk(id)
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' })
    }

    await usuario.destroy()

    return res.status(204).send()
  }
}

export default UsuarioController
