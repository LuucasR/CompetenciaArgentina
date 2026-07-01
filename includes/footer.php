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
if (basename($_SERVER['PHP_SELF']) === 'index.php') {
?>
    <script src="<?= BASE_URL ?>js/app.js"></script>
<?php
}
?>

<!-- BOTONES REDES -->

<div class="social-floating">

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