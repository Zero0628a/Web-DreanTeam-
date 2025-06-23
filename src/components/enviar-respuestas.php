<?php
include 'conexion.php';

// Obtener la respuesta enviada por el usuario
$usuario_respuesta = isset($_POST['respuesta']) ? $_POST['respuesta'] : '';

// Validar si la respuesta fue enviada
if (empty($usuario_respuesta)) {
    echo json_encode(['error' => 'No se recibió ninguna respuesta.']);
    exit;
}

// Consultar la tabla de respuestas
$query = "SELECT respuesta FROM respuesta WHERE respuesta = $1 LIMIT 1"; // Limitar para obtener solo una coincidencia
$result = pg_query_params($conn, $query, array($usuario_respuesta));

if ($result) {
    if (pg_num_rows($result) > 0) {
        // Respuesta correcta
        echo json_encode(['correcto' => true, 'mensaje' => '¡Correcto! La respuesta es correcta.']);
    } else {
        // Respuesta incorrecta
        echo json_encode(['correcto' => false, 'mensaje' => 'Incorrecto. Intenta de nuevo.']);
    }
} else {
    // Error en la consulta
    echo json_encode(['error' => 'Error al consultar la base de datos.']);
}

// Cerrar la conexión
pg_close($conn);
?>
