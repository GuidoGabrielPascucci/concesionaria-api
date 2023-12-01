"use strict";
/// <reference path="./src/classes/Database.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = require("./src/classes/Database");
//#region MODULOS REQUERIDOS
const express = require('express');
const mysql = require('mysql');
const expressMyConnection = require('express-myconnection');
const multer = require('multer');
const mime = require('mime-types');
const fs = require('fs');
//#endregion
//#region CONFIGURACIÓN DEL SERVIDOR
const app = express();
const PORT = 3000;
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressMyConnection(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'concesionaria'
}, 'single'));
const upload = multer({
    dest: 'public/fotos/'
});
//#endregion
//#region MIDDLEWARES
// NOTAS:
// Se puede hacer un middleware que afecte a todas las peticiones, o a algunas rutas especificadas (se agrega como primer parámetro la/las rutas)
// - trackear la request a la base de datos
// - revisar si el usuario tiene cookies
// app.use((request:any, response:any, next:any) => {
//   next();
// })
// app.use((request: any, response: any, next: any) => {
//   response.send("Has pasado por el middleware global");
// })
//#endregion
//#region RUTAS
// raiz
app.get('/', (request, response) => {
    const title = "<h1>TEST_API</h1>";
    const method = "<h2>Método [GET]</h2>";
    const endpoint = "<h3>Endpoint --------- /</h3>";
    const desc = "API testeada!!!";
    response.send(`${title + method + endpoint + desc}`);
});
// traer todos
app.get('/autos', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new Database_1.Database(request.getConnection);
    try {
        const results = yield db.TraerTodos();
        response.send(JSON.stringify(results));
    }
    catch (err) {
        response.send(err);
    }
}));
// traer uno
app.get('/autos/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new Database_1.Database(request.getConnection);
    const id = request.params.id;
    try {
        const result = yield db.TraerUno(id);
        response.send(JSON.stringify(result));
    }
    catch (err) {
        response.send(err);
    }
}));
// agregar
app.post('/autos', upload.single('foto'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new Database_1.Database(request.getConnection);
    const data_auto = request.body;
    const file = request.file;
    const extension = mime.extension(file.mimetype);
    const path = file.destination + data_auto.patente + '.' + data_auto.marca + '.' + extension;
    fs.renameSync(file.path, path);
    data_auto.foto = path;
    try {
        const result = yield db.Agregar(data_auto);
        const success = result['success'];
        const message = result['message'];
        const obj = { success, message };
        response.send(JSON.stringify(obj));
    }
    catch (err) {
        response.send(err);
    }
}));
// modificar
app.put('/autos', upload.single('foto'), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new Database_1.Database(request.getConnection);
    const data_auto = request.body;
    if (request.file !== undefined) {
        const file = request.file;
        const extension = mime.extension(file.mimetype);
        const path = file.destination + data_auto.patente + '.' + data_auto.marca + '.' + extension;
        fs.renameSync(file.path, path);
        data_auto.foto = path;
    }
    try {
        const result = yield db.Modificar(data_auto);
        const success = result['success'];
        const message = result['message'];
        const obj = { success, message };
        response.send(JSON.stringify(obj));
    }
    catch (err) {
        response.send(err);
    }
}));
// eliminar
app.delete('/autos/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const db = new Database_1.Database(request.getConnection);
    const id = request.params.id;
    try {
        const result = yield db.Eliminar(id);
        const success = result['success'];
        const message = result['message'];
        const obj = { success, message };
        response.send(JSON.stringify(obj));
    }
    catch (err) {
        response.send(err);
    }
}));
//#endregion
//#region REDIRECCIONES
// tratar 404 NOT FOUND (ultima a la que va a llegar)
app.use((request, response) => {
    response.status(404).send('<h1>404 NOT FOUND BRO</h1>');
});
// para todos los métodos http de las requestuest, va a pasar por aquí.
//#endregion
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
//# sourceMappingURL=server.js.map