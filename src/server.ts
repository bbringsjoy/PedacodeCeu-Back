import app from "./app";
import sequelize from "./config/database";

import "./models/Usuario";
import "./models/Categoria";
import "./models/Produto";

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
  });
}).catch((err) => {
  console.error("Erro ao conectar ao banco de dados:", err);
});