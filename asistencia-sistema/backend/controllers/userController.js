const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ firstName, lastName });
        if (userExists) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear un nuevo usuario
        const newUser = new User({
            firstName,
            lastName,
            password: hashedPassword
        });

        // Guardar usuario en la base de datos
        await newUser.save();

        // Respuesta de éxito
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error); // Esto te ayudará a ver el error en la consola del servidor
        res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
};
// Inicio de sesión de usuario
const loginUser = async (req, res) => {
    try {
        const { firstName, lastName, password } = req.body;

        // Buscar el usuario por nombre
        const user = await User.findOne({ firstName, lastName });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Comparar la contraseña ingresada con la almacenada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Respuesta de éxito con el token
        res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
