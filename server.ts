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

app.get('/', (request: any, response: any) => {
  const title = "<h1>TEST_API</h1>";
  const method = "<h2>Método [GET]</h2>"
  const endpoint = "<h3>Endpoint --------- /</h3>"
  const desc = "API testeada!!!"
  response.send(`${title + method + endpoint + desc}`);
})

// traer todos
app.get('/autos', async (request: any, response: any) => {

  request.getConnection((err: any, connection: any) => {

    if (err) {
      throw ('Error en la conexión');
    }

    connection.query('SELECT * FROM autos', (err: any, results: any) => {

      if (err) {
        throw ('Error en la consulta');
      }

      response.send(JSON.stringify(results));

    })

  })

})

// traer uno
app.get('/autos/:id', (request: any, response: any) => {

  request.getConnection((err: any, connection: any) => {
    const id = request.params.id;
    if (err) {
      throw ('Error en la conexión');
    }
    connection.query('SELECT * FROM autos WHERE id = ?', id, (err: any, responseults: any) => {
      if (err) {
        throw ('Error en la consulta');
      }
      response.send(JSON.stringify(responseults));
    })
  })

})

// agregar
app.post('/autos', upload.single('foto'), (request: any, response: any) => {

  const data_auto = request.body;
  const file = request.file;
  const extension = mime.extension(file.mimetype);
  const path = file.destination + data_auto.patente + '.' + data_auto.marca + '.' + extension;
  fs.renameSync(file.path, path);

  data_auto.foto = path;

  request.getConnection((err: any, connection: any) => {

    if (err) {
      throw ('Error en la conexión');
    }

    connection.query('INSERT INTO autos SET ?', data_auto, (err: any, results: any) => {

      if (err) {
        throw ('Error en la consulta');
      }

      response.send(`Auto ID número ${results.insertId} agregado con éxito`);

    })

  })

})

// app.put('/autos', upload.single('foto'), (request: any, response: any) => {

//   const data_auto = request.body;
//   const file = request.file;
//   const extension = mime.extension(file.mimetype);
//   const path = file.destination + data_auto.patente + '.' + data_auto.marca + '.' + extension;
//   fs.renameSync(file.path, path);

//   data_auto.foto = path;

//   request.getConnection((err: any, connection: any) => {

//     if (err) {
//       throw('Error en la conexión');
//     }

//     let id: number = 0;

//     connection.query('SELECT id FROM autos WHERE patente=?', data_auto.patente, (err: any, results: any) => {

//       if (err) {
//         throw('Error en la consulta');
//       }

//       if (results.length === 0) {
//         response.send(`No existe registrado un auto con patente ${data_auto.patente}`);
//       }
//       else {
//         id = results[0].id;
//       }

//     })

//     console.log("on");
//     console.log(id);
//     console.log("off");

//     connection.query('UPDATE autos SET ? WHERE id=?', [data_auto, id], (err: any, results: any) => {

//       if (err) {
//         throw('Error en la consulta');
//       }

//       console.log("Dentro del UPDATE");
//       console.log(id);

//       if (results.changedRows === 1) {
//         response.send(`Auto ID número ${data_auto.id} modificado con éxito`);
//       }
//       else {
//         response.send(`Error, no se pudo modificar`);
//       }

//     })

//   })

// })

app.put('/autos', upload.single('foto'), (request: any, response: any) => {

  const data_auto = request.body;

  if (request.file !== undefined) {
    const file = request.file;
    const extension = mime.extension(file.mimetype);
    const path = file.destination + data_auto.patente + '.' + data_auto.marca + '.' + extension;
    fs.renameSync(file.path, path);
    data_auto.foto = path;
  }

  request.getConnection((err: any, connection: any) => {

    if (err) {
      throw ('Error en la conexión');
    }

    connection.query('SELECT id FROM autos WHERE patente=?', data_auto.patente, (err: any, results: any) => {

      if (err) {
        throw ('Error en la consulta');
      }

      if (results.length === 0) {
        response.send(`No existe registrado un auto con patente ${data_auto.patente}`);
      }
      else {

        let id: number = results[0].id;

        connection.query('UPDATE autos SET ? WHERE id=?', [data_auto, id], (err: any, results: any) => {

          if (err) {
            throw ('Error en la consulta');
          }

          if (results.changedRows === 1) {
            response.send(`Auto ID número ${id} modificado con éxito`);
          }
          else {
            response.send(`Error, no se pudo modificar`);
          }

        })
      }

    })

  })

});

app.delete('/autos/:id', (request: any, response: any) => {

  request.getConnection((err: any, connection: any) => {

    if (err) {
      throw ('Error')
    }

    const id: number = request.params.id;

    connection.query('DELETE FROM autos WHERE id=?', id, (err: any, results: any) => {

      if (err) {
        throw ('Error')
      }

      if (results.affectedRows === 1) {
        response.send("El registro ha sido eliminado exitosamente");
      } else {
        response.send("No se ha eliminado ningún registro");
      }

    })

  })

  const id = request.params.id;



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