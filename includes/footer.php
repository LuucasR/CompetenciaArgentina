<footer>
  🇦🇷 Hecho en Argentina – Competencia Argentina © 2026
  <br>
  Desarrollo & Tecnología: Lucas Rodríguez
</footer>


<div class="modal" id="productModal">
  <div class="modal-content">
    <div class="modal-body" id="modalBody"></div>
  </div>
</div>

<?php
$esIndex = basename($_SERVER['PHP_SELF']) === 'index.php';

if ($esIndex) {
?>
    <!-- CARRITO -->

    <div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>

    <aside class="cart-drawer" id="cartDrawer" aria-label="Carrito de compras">
      <div class="cart-header">
        <h3>Tu carrito</h3>
        <button type="button" class="cart-close" onclick="closeCart()" aria-label="Cerrar carrito">✕</button>
      </div>

      <div class="cart-items" id="cartItems"></div>

      <div class="cart-footer">
        <div class="cart-total">
          <span>Total estimado:</span>
          <strong id="cartTotal">$0</strong>
        </div>
        <button type="button" class="buy-btn whatsapp" id="cartSend" onclick="sendCartToWhatsApp()">
          Enviar pedido por WhatsApp
        </button>
        <button type="button" class="cart-clear" id="cartClear" onclick="clearCart()">
          Vaciar carrito
        </button>
      </div>
    </aside>

    <script src="<?= BASE_URL ?>js/app.js?v=<?= filemtime(__DIR__ . '/../js/app.js') ?>"></script>
<?php
} else {
?>
    <script>
      // Contador del carrito en el menú para páginas sin app.js
      try {
        const cartGuardado = JSON.parse(localStorage.getItem("ca_cart")) || [];
        const unidades = cartGuardado.reduce((sum, item) => sum + item.cantidad, 0);
        if (unidades > 0) document.getElementById("navCartCount").textContent = unidades;
      } catch (error) {}
    </script>
<?php
}
?>

<!-- BOTONES REDES -->

<div class="social-floating">

<?php if ($esIndex) { ?>
  <button type="button" class="social-btn cart-btn" id="cartButton" onclick="openCart()" aria-label="Ver carrito">
    🛒
    <span class="cart-badge" id="cartBadge">0</span>
  </button>
<?php } ?>

  <a href="https://wa.me/541169233139" 
     target="_blank" 
     class="social-btn whatsapp">
    <img src="<?= BASE_URL ?>img/sources/IcoW.png" alt="WhatsApp">
  </a>

  <a href="https://www.instagram.com/competenciaargentina/" 
     target="_blank" 
     class="social-btn instagram">
  <img src="<?= BASE_URL ?>img/sources/IcoI.png" alt="Instagram">
  </a>

  <a href="https://www.facebook.com/profile.php?id=61588363227913" 
     target="_blank" 
     class="social-btn facebook">
  <img src="<?= BASE_URL ?>img/sources/IcoF.png" alt="Facebook">
  </a>

</div>


</body>
</html>
