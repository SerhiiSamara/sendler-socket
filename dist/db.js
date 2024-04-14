"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
const pool = new pg_1.Pool({
    host: DB_HOST,
    port: 5432,
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD,
});
exports.default = pool;
//# sourceMappingURL=db.js.map