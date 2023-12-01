export class Database {
    
  private _getConnection: any;

  public constructor(getConnection: any) {

    this._getConnection = getConnection;

  }

  public TraerTodos() {

    return this._generateConnection('SELECT * FROM autos');

  }

  public TraerUno(id: number) {

    return this._generateConnection('SELECT * FROM autos WHERE id = ?', id)

  }

  public Agregar(data: any) {

    return this._generateConnection('INSERT INTO autos SET ?', data)
      .then((resultSet: any) => {
        if (resultSet.affectedRows === 1)
        {
          resultSet.success = true;
          resultSet.message = "El registro ha sido agregado exitosamente";
        }
        else
        {
          resultSet.success = false;
          resultSet.message = "No se ha podido agregar el registro";
        }
        return resultSet;
      })

  }

  public Modificar(data: any) {

    return this._generateConnection('SELECT id FROM autos WHERE patente = ?', data.patente)
      .then((resultSet: any) => {
        if (resultSet.length === 0)
        {
          resultSet.success = false;
          resultSet.message = `No existe registrado un auto con patente "${data.patente}"`;
        }
        else
        {
          let id: number = resultSet[0].id;
          resultSet = this._generateConnection('UPDATE autos SET ? WHERE id = ?',  [data, id])
            .then((resultSet: any) => {
              if (resultSet.changedRows === 1)
              {
                resultSet.success = true;
                resultSet.message = `La información del auto ha sido actualizada con éxito`;
              }
              else
              {
                resultSet.success = false;
                resultSet.message = `Error, no se ha podido actualizar la información`;
              }
              return resultSet;
            })
        }
        return resultSet;
      })

  }

  public Eliminar(id: any) {

    return this._generateConnection('DELETE FROM autos WHERE id = ?', id)
      .then((resultSet: any) => {
        if (resultSet.affectedRows === 1)
        {
          resultSet.message = "El registro ha sido eliminado exitosamente";
          resultSet.success = true;
        }
        else
        {
          resultSet.message = "No se ha eliminado ningún registro";
          resultSet.success = false;
        }
        return resultSet;
      });

  }

  private _generateConnection(queryString: string, data: any = undefined) {

    return new Promise((resolve: any, reject: any) => {

      this._getConnection((err: any, connection: any) => {

        if (err)
        {
          reject(err);
        }

        connection.query(queryString, data, (err: any, resultSet: any) => {

          if (err)
          {
            reject(err);
          }

          resolve(resultSet);

        });

      })

    })

  }

}