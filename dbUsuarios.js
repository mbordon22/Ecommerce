const mongoClient = require("mongodb").MongoClient;

const url = "mongodb+srv://mbordon22:Maximiliano41384334@cluster0.cy3xo.mongodb.net/test";

function TraerUsuario(usuario, pass, cbErr, cbProducto) {
  // Conexión. Función asincrónica. Recibe por callback error o cliente.
  mongoClient.connect(url, function (err, client) {
    if (err) {
      console.log("Hubo un error conectando con el servidor:", err);
      // Si hay error lo retorno al callback de error y termino la función.
      cbErr(err);
      return;
    }

    // Conecto base de datos y colección
    const dbEjemploProds = client.db("ProyectoEcommerce");
    const colProductos = dbEjemploProds.collection("Usuarios");

    // Consulto todos los documentos y los paso a Array (función asincrónica)
    colProductos.findOne({ UsuarioNick : usuario, UsuarioPass : pass }, function (err, datos) {
      // Ya tengo los datos, cierro la conexión.
      client.close();

      if (err) {
        console.log("Hubo un error al consultar:", err);
        cbErr(err);
        return;
      }

      // Si llegué acá no hubo errores, los retorno al callback de datos
      cbProducto(datos);
    });
  });
}

module.exports = {
    TraerUsuario,
};
