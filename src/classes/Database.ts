export class Database {
    
  private instancia: Database;

  private constructor() {
    this.instancia = new Database();
  }

  public static TraerTodos(request: any) {

    return new Promise((resolve, reject) => {
  
      request.getConnection((err: any, connection: any) => {
  
        if (err)
        {
          reject(err);
        }

        connection.query('SELECT * FROM autos', (err: any, results: any) => {
        
          if (err)
          {
            reject(err);
          }
        
          resolve(results);
  
        })
  
      })

    })

  }

}