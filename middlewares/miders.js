const expressJwt = require("express-jwt")

const reporteConsultas = (req, res, next)=>{
    console.log(
        `Se ha realizado una consulta en la ruta ${req.url}`,req.params);
    next()
}
const validaToken = expressJwt({secret:'Za_Za', algorithms:['HS256']})


module.exports = { reporteConsultas , validaToken}