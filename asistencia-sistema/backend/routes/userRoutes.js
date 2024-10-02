const express = require('express');
const User = require('../models/User'); // Cambia 'userModel' por 'User'
const router = express.Router();
const jwt = require('jsonwebtoken');

// Ruta para registrar usuario
router.post('/register', async (req, res) => {
    const { firstName, lastName, password } = req.body;

    try {
        // Verifica si ya existe un usuario con el mismo nombre o correo (opcional)
        const existingUser = await User.findOne({ firstName, lastName });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }

        const newUser = new User({ firstName, lastName, password });
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({
            message: 'Error al registrar el usuario',
            error: error.message, // Devuelve el mensaje del error para mayor claridad
        });
    }
});

// Ruta para login de usuarios
router.post('/login', async (req, res) => {
    const { firstName, password } = req.body;

    try {
        const user = await User.findOne({ firstName });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error('Error en login:', error); // Agrega esta línea para registrar el error
        res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
});
module.exports = router;

