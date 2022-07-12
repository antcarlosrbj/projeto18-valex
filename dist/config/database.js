import dotenv from "dotenv";
import pg from "pg";
dotenv.config();
var Pool = pg.Pool;
var configDatabase = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true
    }
};
if (process.env.MODE === "PROD") {
    configDatabase.ssl = {
        rejectUnauthorized: false
    };
}
export var connection = new Pool(configDatabase);
