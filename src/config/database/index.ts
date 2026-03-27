import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    "pedacodoceu",
    "mysql", //ou postgres
    "mysecretpassword",
    {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql', 
        logging: true
    }
);

export default sequelize;