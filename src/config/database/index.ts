import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "pedacodoceu",
    "root",
    "",
    {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        logging: false
    }
);

sequelize.sync({ alter: false }).catch((err) => {
    console.error("Erro ao sincronizar banco:", err);
});

export default sequelize;