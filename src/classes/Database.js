"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
class Database {
    constructor(getConnection) {
        this._getConnection = getConnection;
    }
    TraerTodos() {
        return this._generateConnection('SELECT * FROM autos');
    }
    TraerUno(id) {
        return this._generateConnection('SELECT * FROM autos WHERE id = ?', id);
    }
    Agregar(data) {
        return this._generateConnection('INSERT INTO autos SET ?', data)
            .then((resultSet) => {
            if (resultSet.affectedRows === 1) {
                resultSet.success = true;
                resultSet.message = "El registro ha sido agregado exitosamente";
            }
            else {
                resultSet.success = false;
                resultSet.message = "No se ha podido agregar el registro";
            }
            return resultSet;
        });
    }
    Modificar(data) {
        return this._generateConnection('SELECT id FROM autos WHERE patente = ?', data.patente)
            .then((resultSet) => {
            if (resultSet.length === 0) {
                resultSet.success = false;
                resultSet.message = `No existe registrado un auto con patente "${data.patente}"`;
            }
            else {
                let id = resultSet[0].id;
                resultSet = this._generateConnection('UPDATE autos SET ? WHERE id = ?', [data, id])
                    .then((resultSet) => {
                    if (resultSet.changedRows === 1) {
                        resultSet.success = true;
                        resultSet.message = `La información del auto ha sido actualizada con éxito`;
                    }
                    else {
                        resultSet.success = false;
                        resultSet.message = `Error, no se ha podido actualizar la información`;
                    }
                    return resultSet;
                });
            }
            return resultSet;
        });
    }
    Eliminar(id) {
        return this._generateConnection('DELETE FROM autos WHERE id = ?', id)
            .then((resultSet) => {
            if (resultSet.affectedRows === 1) {
                resultSet.message = "El registro ha sido eliminado exitosamente";
                resultSet.success = true;
            }
            else {
                resultSet.message = "No se ha eliminado ningún registro";
                resultSet.success = false;
            }
            return resultSet;
        });
    }
    _generateConnection(queryString, data = undefined) {
        return new Promise((resolve, reject) => {
            this._getConnection((err, connection) => {
                if (err) {
                    reject(err);
                }
                connection.query(queryString, data, (err, resultSet) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(resultSet);
                });
            });
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map