const pool = require('../db/db');

const crearInscripcion = async (req, res) => {
  const id_alumno = req.usuario.id;
  const { id_asignatura } = req.body;

  if (!id_asignatura) {
    return res.status(400).json({ error: 'Falta el id_asignatura' });
  }

  try {
    // Verificar si hay cupos disponibles
    const cupoQuery = await pool.query(
      'SELECT cupos_disponibles FROM asignatura WHERE id_asignatura = $1',
      [id_asignatura]
    );

    if (cupoQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Asignatura no encontrada' });
    }

    const cupos = cupoQuery.rows[0].cupos_disponibles;
    if (cupos <= 0) {
      return res.status(400).json({ error: 'No hay cupos disponibles' });
    }

    // Verificar si ya está inscrito
    const existe = await pool.query(
      'SELECT * FROM inscripcion WHERE id_alumno = $1 AND id_asignatura = $2',
      [id_alumno, id_asignatura]
    );
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Ya estás inscrito en esta asignatura' });
    }

    // Insertar inscripción
    const fecha = new Date();
    const result = await pool.query(
      'INSERT INTO inscripcion (id_asignatura, id_alumno, fecha_inscripcion) VALUES ($1, $2, $3) RETURNING *',
      [id_asignatura, id_alumno, fecha]
    );

    // Actualizar cupos
    await pool.query(
      'UPDATE asignatura SET cupos_disponibles = cupos_disponibles - 1 WHERE id_asignatura = $1',
      [id_asignatura]
    );

    res.status(201).json({ mensaje: 'Inscripción exitosa', inscripcion: result.rows[0] });

  } catch (err) {
    console.error('Error al inscribir:', err);
    res.status(500).json({ error: 'Error interno al inscribir' });
  }
};

module.exports = { crearInscripcion };

const obtenerInscripciones = async (req, res) => {
  const id_alumno = req.usuario.id;

  try {
    const result = await pool.query(
      `SELECT i.id_inscripcion, i.fecha_inscripcion, 
              a.nombre AS asignatura, a.codigo, a.creditos
       FROM inscripcion i
       JOIN asignatura a ON i.id_asignatura = a.id_asignatura
       WHERE i.id_alumno = $1`,
      [id_alumno]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener inscripciones:', err);
    res.status(500).json({ error: 'Error interno al obtener inscripciones' });
  }
};


const eliminarInscripcion = async (req, res) => {
  const id_alumno = req.usuario.id;
  const id_inscripcion = req.params.id;

  try {
    // Obtener la inscripción
    const result = await pool.query(
      'SELECT * FROM inscripcion WHERE id_inscripcion = $1 AND id_alumno = $2',
      [id_inscripcion, id_alumno]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada o no autorizada' });
    }

    const id_asignatura = result.rows[0].id_asignatura;

    // Eliminar la inscripción
    await pool.query(
      'DELETE FROM inscripcion WHERE id_inscripcion = $1 AND id_alumno = $2',
      [id_inscripcion, id_alumno]
    );

    // Incrementar cupo en la asignatura
    await pool.query(
      'UPDATE asignatura SET cupos_disponibles = cupos_disponibles + 1 WHERE id_asignatura = $1',
      [id_asignatura]
    );

    res.json({ mensaje: 'Inscripción eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar inscripción:', err);
    res.status(500).json({ error: 'Error interno al eliminar inscripción' });
  }
};


const obtenerInscripcionesPorAsignatura = async (req, res) => {
  const idAsignatura = req.params.id;

  try {
    const result = await pool.query(
      `SELECT i.id_inscripcion, i.fecha_inscripcion, 
              a.id_alumno, a.nombre AS nombre_alumno, a.email
       FROM inscripcion i
       JOIN alumno a ON i.id_alumno = a.id_alumno
       WHERE i.id_asignatura = $1`,
      [idAsignatura]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener inscripciones por asignatura:', err);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};

module.exports = {
  crearInscripcion,
  obtenerInscripciones,
  eliminarInscripcion,
  obtenerInscripcionesPorAsignatura
};

