<?php

$errores = [];

$nombre = trim($_POST["nombre"] ?? "");
$email = trim($_POST["email"] ?? "");
$telefono = trim($_POST["telefono"] ?? "");
$interes = trim($_POST["interes"] ?? "");
$mensaje = trim($_POST["mensaje"] ?? "");

if ($nombre == "") {
    $errores[] = "Debe ingresar un nombre.";
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = "Email inválido.";
}

if (!is_numeric($telefono) || strlen($telefono) < 8) {
    $errores[] = "Teléfono inválido.";
}

if ($interes == "") {
    $errores[] = "Debe seleccionar un producto de interés.";
}

if ($mensaje == "") {
    $errores[] = "Debe escribir un mensaje.";
}

if (!empty($errores)) {

    echo "<h2>Se encontraron errores:</h2>";

    foreach ($errores as $error) {
        echo "<p>$error</p>";
    }

    echo "<a href='contacto.php'>Volver</a>";
    exit;
}

require_once __DIR__ . '/../config/config.php';
include '../includes/header.php';
include '../includes/navbar.php';
?>

<div class="container">
    <h1>Formulario enviado correctamente.</h1>
    <p>Gracias por contactarte con Competencia Argentina.</p>
    <a href="contacto.php">Volver al formulario</a>
</div>

<?php include '../includes/footer.php'; ?>