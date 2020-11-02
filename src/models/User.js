// Definir estructura de modelo de datos
const mongoose = require('mongoose') // Requerir mongoose para generar esquema de datos
const { Schema } = mongoose // Requerir la clase esquema de datos de moongose
const bcryptjs = require('bcryptjs') // Requerir modulo para encriptar contraseñas
// Clase que define la estructura de las users (propiedades, valor)
const UserSchema = new Schema ({
    name: { type: String, required: true }, // Nombre requerido
    email: { type: String, required: true }, // email requerido
    password: { type: String, required: true }, // password requerido
    date: { type: Date, default: Date.now } // Si no digitamos una fecha nos devolvera la actual de creación
})

// Encriptar contraseña con bcryptsjs (.methods.encryptPassword es de bcryptjs)
UserSchema.methods.encryptPassword = async (password) => { // Al modelo de datos usamos su metodo encryptar password, le pasamos el password (usuario lo tipea)
    const salt = await bcryptjs.genSalt(10); // Realiza el algoritmo de Hash 10 veces
    const hash = bcryptjs.hash(password, salt) // Obtener hash (contraseña cifrada, hara el algoritmo con la contraseña antigua y el hash creadó)
    return hash // Retorna el hash
}
// Comparar lo cifrado con el password de la base de datos
UserSchema.methods.matchPassword = async function (password) { // Usamos 'function' para que el scope no se pierda, le pasamos la contraseña cifrada
    return await bcryptjs.compare(password, this.password) // Retornamos la comparación del password cifrado (password) con el de la base de datos (this.password)
}

// Exportar modulo del modelo de datos de mongoose
module.exports = mongoose.model('User', UserSchema) // Exportar userSchema como User