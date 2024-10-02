const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    shift: {
        type: String,
        enum: ['Matutino', 'Vespertino', 'Nocturno'],
        required: true
    },
    attendanceStatus: {
        type: String,
        enum: ['Asistencia', 'Falta Justificada', 'Falta Injustificada', 'Descanso', 'Tiempo Extra'],
        required: true
    },
    observations: {
        type: String
    }
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
