"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
class Database {
    constructor() {
        this.instancia = new Database();
    }
    static TraerTodos(request) {
        return new Promise((resolve, reject) => {
            request.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                connection.query('SELECT * FROM autos', (err, results) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(results);
                });
            });
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map