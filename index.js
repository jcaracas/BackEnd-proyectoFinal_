const express = require('express')
const jwt = require("jsonwebtoken")
const app = express()
const cors = require('cors')
const { reporteConsultas} = require("./middlewares/miders")

app.listen(3000, console.log("¡Servidor encendido!"))
app.use(cors())
app.use(express.json())

const params = "paralelepipedo123"

const { verificarCredenciales, registrarUsuario, generarPerfiles, obtenerUsuarios, updateUsuarios, registrarProductos, registrarCategorias, obtenerProductos, obtenerProductosId, comprar, obtenerCompras, obtenerUsuario, modificarUsuario } = require('./middleware')

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    await verificarCredenciales(email, password)
    // se utiliza middleware jwt
    const token = jwt.sign({ email }, params)
    res.status(200).send(token)
  } catch (error) {
    console.log(error)
    res.status(error.code || 500).send(error)
  }
}
)
// crear usuarios
app.post("/usuarios", reporteConsultas,async (req, res) => {
  try {
    const usuario = req.body
    await registrarUsuario(usuario)
    res.status(200).send("Usuario creado con éxito")
  } catch (error) {
    res.status(500).send(error)
  }
}
)
//select usuarios
app.get("/usuarios", reporteConsultas,async (req, res) => {
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    const rows = await obtenerUsuarios()
    res.status(400).send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
)


//update usuarios
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    const rows = await updateUsuarios(id, req.body)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
)

app.post("/perfiles", async (req, res) => {
  try {
    const perfil = req.body
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    await generarPerfiles(perfil)
    res.send("Perfil creado con éxito")
  } catch (error) {
    res.status(500).send(error)
  }
}
)
// crear productos
app.post("/productos", async (req, res) => {
  try {
    const producto = req.body
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    await registrarProductos(producto)
    res.send("Producto creado con éxito")
  } catch (error) {
    res.status(500).send(error)
  }
}
)
// crear categorias
app.post("/categoria", async (req, res) => {
  try {
    const categoria = req.body
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    await registrarCategorias(categoria)
    res.send("Categoria creado con éxito")
  } catch (error) {
    res.status(500).send(error)
  }
}
)

//select productos
app.get("/productos", async (req, res) => {
  try {
    const rows = await obtenerProductos()
    console.log(rows)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
) 

//select productos detalle
app.get("/productos/:id", async (req, res) => {
  try {
    const { id } = req.params
    const rows = await obtenerProductosId(id)
    res.send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
)

app.post("/comprar", async (req, res) => {
  try {
    const Authorization = req.header("Authorization")
    const datosCompra = req.body
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    const { email } = jwt.decode(token)
    await comprar(email, datosCompra)
    if (comprar) res.status(200).send(`Compra realizada`)
    else res.status(404).send({ message: "No se encontró ninguna compra" })
  } catch (error) {
    res.status(500).send(error)
    console.log(error);
  }
})
//select usuarios
app.get("/compras", async (req, res) => {
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    const { email } = jwt.decode(token)
    const rows = await obtenerCompras(email)
    res.status(400).send(rows)
  } catch (error) {
    res.status(500).send(error)
  }
}
)


// Agregar esta ruta para obtener el usuario logueado
app.get("/usuario", reporteConsultas,async (req, res) => {
  try {
    const Authorization = req.header("Authorization")
    const token = Authorization.split("Bearer ")[1]
    jwt.verify(token, params)
    const { email } = jwt.decode(token)
    const usuario = await obtenerUsuario(email)
    //res.json(usuario)
    res.send(usuario)
  } catch (error) {
    res.status(500).send(error)
    console.log(error);
  }


})
//Ruta para editar el usuario que se obtiene en la ruta anterior
app.put("/usuario/:id", reporteConsultas,async (req, res) => {
  const { id } = req.params
  const usuario = req.body
  await modificarUsuario(usuario, id)
  res.send("Usuario modificado con éxito")
})

module.exports = app