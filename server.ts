/// <reference path="./src/classes/Database.ts" />

import { Database } from "./src/classes/Database";

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
  database: 'concesionaria' },
  'single'));
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
app.get('/', (request: any, response: any) => {
  const title = "<h1>TEST_API</h1>";
  const method = "<h2>Método [GET]</h2>"
  const endpoint = "<h3>Endpoint --------- /</h3>"
  const desc = "API testeada!!!"
  response.send(`${title + method + endpoint + desc}`);
})

// traer todos
app.get('/autos', async (request: any, response: any) => {

  const db = new Database(request.getConnection);

  try
  {
    const results = await db.TraerTodos();
    response.send(JSON.stringify(results));
  }
  catch(err)
  {
    response.send(err);
  }

})

// traer uno
app.get('/autos/:id', async (request: any, response: any) => {

  const db = new Database(request.getConnection);
  const id = request.params.id;

  try
  {
    const result = await db.TraerUno(id);
    response.send(JSON.stringify(result));
  }
  catch (err)
  {
    response.send(err);
  }

})

// agregar
app.post('/autos', upload.single('foto'), async (request: any, response: any) => {

  const db = new Database(request.getConnection);
  const data_auto = request.body;
  const file = request.file;
  const extension = mime.extension(file.mimetype);
  const path = file.destination + data_auto.patente + '.' + data_auto.marca + '.' + extension;
  fs.renameSync(file.path, path);
  data_auto.foto = path;

  try
  {
    const result = await db.Agregar(data_auto);
    const success = result['success'];
    const message = result['message'];
    const obj: any = { success, message };
    response.send(JSON.stringify(obj));
  }
  catch (err)
  {
    response.send(err);
  }

})

// modificar
app.put('/autos', upload.single('foto'), async (request: any, response: any) => {

  const db = new Database(request.getConnection);
  const data_auto = request.body;

  if (request.file !== undefined)
  {
    const file = request.file;
    const extension = mime.extension(file.mimetype);
    const path = file.destination + data_auto.patente + '.' + data_auto.marca + '.' + extension;
    fs.renameSync(file.path, path);
    data_auto.foto = path;
  }

  try
  {
    const result = await db.Modificar(data_auto);
    const success = result['success'];
    const message = result['message'];
    const obj: any = { success, message };
    response.send(JSON.stringify(obj));
  }
  catch (err)
  {
    response.send(err);
  }

});

// eliminar
app.delete('/autos/:id', async (request: any, response: any) => {

  const db = new Database(request.getConnection);
  const id = request.params.id;

  try
  {
    const result: any = await db.Eliminar(id);
    const success = result['success'];
    const message = result['message'];
    const obj: any = { success, message }
    response.send(JSON.stringify(obj));
  }
  catch (err)
  {
    response.send(err);
  }

});

//#endregion

//#region REDIRECCIONES

// tratar 404 NOT FOUND (ultima a la que va a llegar)
app.use((request: any, response: any) => {
  response.status(404).send('<h1>404 NOT FOUND BRO</h1>');
});
// para todos los métodos http de las requestuest, va a pasar por aquí.

//#endregion

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})