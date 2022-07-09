const express = require("express");
const productos = require("./modulos/productos");

const app = express();
const PORT = 8080;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/productos', productos);

app.use('/', express.static('public'));

const server = app.listen(PORT, (req,res) => {
    console.log(` - El servidor se encuentra activo. Escucha en el puerto ${PORT} - `);
})

server.on("error", e  =>  console.log(`Error en el servidor ${e}`));



