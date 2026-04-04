import express, { Request, Response, Router } from "express";
import "dotenv/config";
import cors from "cors";
import authMiddleware from "./middlewares/auth.middlewares";
import AuthController from "./controllers/auth.controller";
import CategoriaController from "./controllers/categoria.controller";
import ProdutoController from "./controllers/produto.controller";
import UsuarioController from "./controllers/usuario.controller";
import PedidoController from "./controllers/pedido.controller";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));

const router: Router = Router();


router.post("/auth/login", AuthController.login);


router.post("/usuarios", UsuarioController.create);
router.get("/usuarios", authMiddleware, UsuarioController.findAll);
router.get("/usuarios/:id", authMiddleware, UsuarioController.getById);
router.put("/usuarios/:id", authMiddleware, UsuarioController.update);
router.delete("/usuarios/:id", authMiddleware, UsuarioController.remove);


router.get("/categorias", authMiddleware, CategoriaController.findAll);
router.post("/categorias", authMiddleware, CategoriaController.create);
router.get("/categorias/:id", authMiddleware, CategoriaController.getById);
router.put("/categorias/:id", authMiddleware, CategoriaController.update);
router.delete("/categorias/:id", authMiddleware, CategoriaController.remove);


router.get("/produtos", authMiddleware, ProdutoController.findAll);
router.post("/produtos", authMiddleware, ProdutoController.create);
router.get("/produtos/:id", authMiddleware, ProdutoController.getById);
router.put("/produtos/:id", authMiddleware, ProdutoController.update);
router.delete("/produtos/:id", authMiddleware, ProdutoController.remove);



router.get("/pedidos", authMiddleware, PedidoController.findAll);
router.post("/pedidos", authMiddleware, PedidoController.create);
router.get("/pedidos/:id", authMiddleware, PedidoController.getById);
router.put("/pedidos/:id", authMiddleware, PedidoController.update);
router.delete("/pedidos/:id", authMiddleware, PedidoController.remove);

app.use(router);

export default app;