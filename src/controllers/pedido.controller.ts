import { Request, Response } from "express";
import Pedido from "../models/Pedido";
import PedidoItem from "../models/Pedido";
import Produto from "../models/Produto";
import Usuario from "../models/Usuario";

class PedidoController {
  // GET /pedidos
  async findAll(req: Request, res: Response): Promise<void> {
    try {
      const pagina = parseInt(req.query.pagina as string) || 1;
      const limite = parseInt(req.query.limite as string) || 10;
      const offset = (pagina - 1) * limite;

      const { count, rows } = await Pedido.findAndCountAll({
        limit: limite,
        offset,
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

      res.json({
        dados: rows,
        meta: {
          total: count,
          pagina,
          limite,
          totalPaginas: Math.ceil(count / limite),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedidos", error });
    }
  }

  // GET /pedidos/:id
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const pedido = await Pedido.findByPk(req.params.id, {
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

      res.json(pedido);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar pedido", error });
    }
  }

  // POST /pedidos
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { usuarioId, status, itens } = req.body;

      if (!usuarioId || !itens || itens.length === 0) {
        res.status(400).json({ message: "usuarioId e itens são obrigatórios" });
        return;
      }

      // Calcula o total com base nos produtos reais
      let total = 0;
      for (const item of itens) {
        const produto = await Produto.findByPk(item.produtoId);
        if (!produto) {
          res.status(400).json({ message: `Produto ${item.produtoId} não encontrado` });
          return;
        }
        total += produto.preco * item.quantidade;
      }

      const pedido = await Pedido.create({ usuarioId, status: status || "pendente", total });

      // Cria os itens do pedido
      for (const item of itens) {
        const produto = await Produto.findByPk(item.produtoId);
        await PedidoItem.create({
          pedidoId: pedido.id,
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          precoUnitario: produto!.preco,
        });
      }

      // Retorna o pedido completo com itens
      const pedidoCriado = await Pedido.findByPk(pedido.id, {
        include: [{ model: PedidoItem, as: "itens", include: [{ model: Produto, as: "produto" }] }],
      });

      res.status(201).json(pedidoCriado);
    } catch (error) {
      res.status(500).json({ message: "Erro ao criar pedido", error });
    }
  }

  // PUT /pedidos/:id
  async update(req: Request, res: Response): Promise<void> {
    try {
      const pedido = await Pedido.findByPk(req.params.id);

      if (!pedido) {
        res.status(404).json({ message: "Pedido não encontrado" });
        return;
      }

      const { status, itens } = req.body;

      if (status) pedido.status = status;

      // Se mandou novos itens, recalcula e substitui
      if (itens && itens.length > 0) {
        await PedidoItem.destroy({ where: { pedidoId: pedido.id } });

        let total = 0;
        for (const item of itens) {
          const produto = await Produto.findByPk(item.produtoId);
          if (!produto) {
            res.status(400).json({ message: `Produto ${item.produtoId} não encontrado` });
            return;
          }
          total += produto.preco * item.quantidade;
          await PedidoItem.create({
            pedidoId: pedido.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: produto.preco,
          });
        }
        pedido.total = total;
      }

      await pedido.save();

      const pedidoAtualizado = await Pedido.findByPk(pedido.id, {
        include: [{ model: PedidoItem, as: "itens", include: [{ model: Produto, as: "produto" }] }],
      });

      res.json(pedidoAtualizado);
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar pedido", error });
    }
  }

  // DELETE /pedidos/:id
  async remove(req: Request, res: Response): Promise<void> {
    try {
      const pedido = await Pedido.findByPk(req.params.id);

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