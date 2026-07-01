<?php
require_once __DIR__ . '/config/config.php';

include 'includes/header.php';
include 'includes/navbar.php';
?>
<section class="featured-section">
  <div class="featured-inner">
    <h2>Lo más destacado para nuestros clientes</h2>
    <p class="subtitle">Calidad accesible para tu hogar</p>
    <div class="featured-container">
      <button class="featured-arrow left" onclick="scrollFeatured(-1)">‹</button>

      <div class="featured-track" id="featuredProducts"></div>

      <button class="featured-arrow right" onclick="scrollFeatured(1)">›</button>
    </div>
  </div>
</section>

<div class="titlecatalogo">     
  <h2>Catalogo</h2>
</div>

<div class="filters">
  <select id="lineaFilter">
    <option value="all">Todas las líneas</option>
  </select>

  <select id="categoriaFilter">
    <option value="all">Todas las categorías</option>
  </select>
</div>

<div class="container">
  <div class="grid" id="productGrid"></div>
</div>
<?php include 'includes/footer.php'; ?>

