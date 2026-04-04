import { Request, Response } from "express";
import Pedido from "../models/Pedido";
import PedidoItem from "../models/PedidoItem";
import Produto from "../models/Produto";
import Usuario from "../models/Usuario";

class PedidoController {

  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await Pedido.findAll({
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: PedidoItem,
            as: "itens",
            include: [{ model: Produto, as: "produto" }],
          },
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email"],
          },
        ],
      });
      res.status(200).json(pedidos);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedidos", error });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const pedido = await Pedido.findByPk(id, {
        include: [
          {
            model: PedidoItem,
            as: "itens",
            include: [{ model: Produto, as: "produto" }],
          },
          {
            model: Usuario,
            as: "usuario",
            attributes: ["id", "nome", "email"],
          },
        ],
      });

      if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
        return;
      }

      res.status(200).json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedido", error });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId, status, itens } = req.body;

      if (!usuarioId) {
        res.status(400).json({ message: "usuarioId é obrigatório" });
        return;
      }

      if (!itens || itens.length === 0) {
        res.status(400).json({ message: "O pedido deve ter ao menos um item" });
        return;
      }

      let total = 0;
      for (const item of itens) {
        const produto = await Produto.findByPk(String(item.produtoId));
        if (!produto) {
          res.status(404).json({ message: `Produto ${item.produtoId} não encontrado` });
          return;
        }
        if (!item.quantidade || item.quantidade <= 0) {
          res.status(400).json({ message: "Quantidade inválida" });
          return;
        }
        total += produto.preco * item.quantidade;
      }

      const pedido = await Pedido.create({
        usuarioId: String(usuarioId),
        status: status || "pendente",
        total,
      });

      for (const item of itens) {
        const produto = await Produto.findByPk(String(item.produtoId));
        await PedidoItem.create({
          pedidoId: pedido.id,
          produtoId: String(item.produtoId),
          quantidade: item.quantidade,
          precoUnitario: produto!.preco,
        });
      }

      const pedidoCriado = await Pedido.findByPk(pedido.id, {
        include: [
          {
            model: PedidoItem,
            as: "itens",
            include: [{ model: Produto, as: "produto" }],
          },
        ],
      });

      res.status(201).json(pedidoCriado);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar pedido", error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
        return;
      }

      const { status, itens } = req.body;

      const statusValidos = ["pendente", "confirmado", "entregue", "cancelado"];
      if (status && !statusValidos.includes(status)) {
        res.status(400).json({ message: "Status inválido" });
        return;
      }

      if (status) pedido.status = status;

      if (itens && itens.length > 0) {
        await PedidoItem.destroy({ where: { pedidoId: pedido.id } });

        let total = 0;
        for (const item of itens) {
          const produto = await Produto.findByPk(String(item.produtoId));
          if (!produto) {
            res.status(404).json({ message: `Produto ${item.produtoId} não encontrado` });
            return;
          }
          total += produto.preco * item.quantidade;
          await PedidoItem.create({
            pedidoId: pedido.id,
            produtoId: String(item.produtoId),
            quantidade: item.quantidade,
            precoUnitario: produto.preco,
          });
        }
        pedido.total = total;
      }

      await pedido.save();

      const pedidoAtualizado = await Pedido.findByPk(pedido.id, {
        include: [
          {
            model: PedidoItem,
            as: "itens",
            include: [{ model: Produto, as: "produto" }],
          },
        ],
      });

      res.status(200).json(pedidoAtualizado);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar pedido", error });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const id = String(req.params.id);
      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
        return;
      }

      await PedidoItem.destroy({ where: { pedidoId: pedido.id } });
      await pedido.destroy();

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar pedido", error });
    }
  }
}

export default new PedidoController();