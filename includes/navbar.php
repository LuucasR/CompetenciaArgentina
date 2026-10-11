<nav class="navbar">
    <a href="<?= BASE_URL ?>index.php">Inicio</a>
    <a href="<?= BASE_URL ?>pages/nosotros.php">Nosotros</a>
    <a href="<?= BASE_URL ?>pages/contacto.php">Contacto</a>
    <a href="<?= BASE_URL ?>index.php?carrito=1" class="nav-cart" onclick="if (window.openCart) { openCart(); return false; }">
        🛒 Carrito <span class="nav-cart-count" id="navCartCount"></span>
    </a>
</nav>