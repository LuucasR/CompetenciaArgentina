<?php
require_once __DIR__ . '/../config/config.php';
include '../includes/header.php';
include '../includes/navbar.php';
?>

<div class="container">

    <h1 style="text-align:center;margin-top:40px;">Contacto</h1>

    <form class="contact-form" method="POST" action="procesar_contacto.php">

        <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            required
        >

        <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            required
        >

        <input
            type="number"
            name="telefono"
            placeholder="Teléfono"
            required
        >


<select name="interes" required>
    <option value="">Seleccione un producto</option>
    <option value="Sábanas">Sábanas</option>
    <option value="Cortinas">Cortinas</option>
    <option value="Mantelería">Mantelería</option>
    <option value="Individuales">Individuales</option>
    <option value="Otro">Otro</option>
</select>

        <textarea
            name="mensaje"
            placeholder="Escribinos tu consulta..."
            required
        ></textarea>

        <button type="submit">
            Enviar consulta
        </button>

    </form>

</div>

<?php include '../includes/footer.php'; ?>