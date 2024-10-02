const express = require('express');
const Attendance = require('../models/Attendance'); // Asegúrate de que coincida con el nombre del archivo
const router = express.Router();

// Ruta para registrar asistencia
router.post('/register', async (req, res) => {
    try {
        const attendanceRecord = new Attendance(req.body);
        await attendanceRecord.save();
        res.status(201).json({
            message: "Asistencia registrada correctamente",
            attendanceRecord
        });
    } catch (error) {
        res.status(400).json({
            message: "Error al registrar asistencia",
            error: error.message
        });
    }
});

module.exports = router;
