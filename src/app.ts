import express, { Request, Response, Router } from "express";
import "dotenv/config";
import authMiddleware from "./middlewares/auth.middlewares";
import AuthController from "./controllers/auth.controller";
import CategoriaController from "./controllers/categoria.controller";
import ProdutoController from "./controllers/produto.controller";
import UsuarioController from "./controllers/usuario.controller";

const app = express();
app.use(express.json());

const router: Router = Router();

// rotas de autenticação
router.post("/auth/login", AuthController.login);

// rotas de usuários
router.post("/usuarios", UsuarioController.create);
router.get("/usuarios", authMiddleware, UsuarioController.findAll);
router.get("/usuarios/:id", authMiddleware, UsuarioController.getById);
router.put("/usuarios/:id", authMiddleware, UsuarioController.update);
router.delete("/usuarios/:id", authMiddleware, UsuarioController.remove);

// rotas de categorias
router.get("/categorias", authMiddleware, CategoriaController.findAll);
router.post("/categorias", authMiddleware, CategoriaController.create);
router.get("/categorias/:id", authMiddleware, CategoriaController.getById);
router.put("/categorias/:id", authMiddleware, CategoriaController.update);
router.delete("/categorias/:id", authMiddleware, CategoriaController.remove);

// rotas de produtos
router.get("/produtos", authMiddleware, ProdutoController.findAll);
router.post("/produtos", authMiddleware, ProdutoController.create);
router.get("/produtos/:id", authMiddleware, ProdutoController.getById);
router.put("/produtos/:id", authMiddleware, ProdutoController.update);
router.delete("/produtos/:id", authMiddleware, ProdutoController.remove);

app.use(router);

export default app;