const SHEET_URL = "https://opensheet.elk.sh/1E9CVyFR-O3GbF9ITdN5M4SJo48q4U7kh3-ypAL9ss78/Sheet1";
const WHATSAPP_NUMBER = "541169233139";

let allProducts = [];

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});

/* =========================
   FETCH PRODUCTS (JSON)
========================= */

async function fetchProducts() {
  try {
    const response = await fetch(SHEET_URL);
    const data = await response.json();

    allProducts = data.map((row) => ({
      id: row.id?.trim(),
      nombre: row.nombre?.trim(),
      descripcion: row.descripcion?.trim(),
      precio: row.precio?.trim(),
      imagen: row.imagen?.trim(),
      caracteristicas: row.caracteristicas?.trim(),
      stock: row.stock?.trim(),
      destacado: row.destacado?.trim(),
      linea: row.linea?.trim(),
      categoria: row.categoria?.trim(),
    }));

    populateLineaFilter();
    renderProducts(allProducts);
    renderFeaturedProducts(); 
  } catch (error) {
    console.error("Error cargando productos:", error);
  }
}

/* =========================
   FILTROS
========================= */

function populateLineaFilter() {
  const lineaFilter = document.getElementById("lineaFilter");

  const lineaSet = new Set();
  allProducts.forEach((p) => {
    if (p.linea) lineaSet.add(p.linea);
  });

  lineaFilter.innerHTML = `<option value="all">Todas las líneas</option>`;

  lineaSet.forEach((linea) => {
    lineaFilter.innerHTML += `<option value="${linea}">${linea}</option>`;
  });

  lineaFilter.addEventListener("change", handleLineaChange);

  updateCategoriaFilter("all");
}

function handleLineaChange() {
  const lineaValue = document.getElementById("lineaFilter").value;

  updateCategoriaFilter(lineaValue);
  applyFilters();
}

function updateCategoriaFilter(lineaSeleccionada) {
  const categoriaFilter = document.getElementById("categoriaFilter");

  const categoriaSet = new Set();

  allProducts.forEach((p) => {
    if (
      p.categoria &&
      (lineaSeleccionada === "all" || p.linea === lineaSeleccionada)
    ) {
      categoriaSet.add(p.categoria);
    }
  });

  categoriaFilter.innerHTML =
    `<option value="all">Todas las categorías</option>`;

  categoriaSet.forEach((categoria) => {
    categoriaFilter.innerHTML +=
      `<option value="${categoria}">${categoria}</option>`;
  });

  categoriaFilter.removeEventListener("change", applyFilters);
  categoriaFilter.addEventListener("change", applyFilters);
}

function applyFilters() {
  const lineaValue = document.getElementById("lineaFilter").value;
  const categoriaValue = document.getElementById("categoriaFilter").value;

  let filtered = allProducts;

  if (lineaValue !== "all") {
    filtered = filtered.filter((p) => p.linea === lineaValue);
  }

  if (categoriaValue !== "all") {
    filtered = filtered.filter((p) => p.categoria === categoriaValue);
  }

  renderProducts(filtered);
}

/* =========================
   RENDER PRODUCTOS
========================= */

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((product) => {

    // 👇 Tomamos SOLO la primera imagen
    const firstImage = product.imagen
      ? product.imagen.split("|")[0].trim()
      : "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${firstImage}" alt="${product.nombre}" loading="lazy">
      <div class="card-content">
        <h3>${product.nombre}</h3>
        <div class="price">$${product.precio}</div>
      </div>
    `;

    card.addEventListener("click", () => openModal(product));
    grid.appendChild(card);
  });
}


/* =========================
   MODAL
========================= */

let currentImages = [];
let currentIndex = 0;
let startX = 0;

function openModal(product) {
  const modal = document.getElementById("productModal");
  const body = document.getElementById("modalBody");

 currentImages = product.imagen
  .split("|")
  .map(url => url.trim())
  .filter(url => url !== "");

  currentIndex = 0;

  body.innerHTML = `
  <span class="close" onclick="closeModal()">✕</span>

  <div class="modal-gallery">
    <button class="nav-btn left" onclick="prevImage()">‹</button>

    <img id="modalImage" 
         src="${currentImages[0]}" 
         onclick="toggleZoom(this)"/>

    <button class="nav-btn right" onclick="nextImage()">›</button>
  </div>

  <div class="thumbnails">
    ${currentImages.map((img, i) => `
      <img src="${img}" 
           class="thumb ${i === 0 ? "active-thumb" : ""}" 
           onclick="goToImage(${i})">
    `).join("")}
  </div>

 <h2>${product.nombre}</h2>

<div class="product-description-box">
    <h4>Descripción</h4>
    <p>${product.descripcion}</p>
</div>

<div class="product-features">
    <strong>Características:</strong>
    <p>${product.caracteristicas}</p>
</div>

<div class="price-box">
    <h4>Precios</h4>
    <div class="price-tier">
        <span>Precio unitario:</span>
        <strong>$${product.precio}</strong>
    </div>
    <div class="price-tier">
        <span>Hasta 3 unidades:</span>
        <strong>$${product.precio * 0.90}</strong>
    </div>
    <div class="price-tier">
        <span>Más de 5 unidades:</span>
        <strong>$${product.precio * 0.62}</strong>
    </div>
</div>

<div class="buy-options">
    <h3 class="buy-title">Opciones de compra</h3>

    <div class="buy-buttons">
        <a class="buy-btn whatsapp"
           target="_blank"
           href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
             "Hola, quiero comprar " + product.nombre
           )}">
           WhatsApp
        </a>

        <a class="buy-btn instagram"
           target="_blank"
           href="https://www.instagram.com/competenciaargentina/">
           Instagram
        </a>

        <a class="buy-btn facebook"
           target="_blank"
           href="https://www.facebook.com/profile.php?id=61588363227913">
           Facebook
        </a>
    </div>
</div>


  
`;
;

  modal.style.display = "flex";

  enableSwipe();
}

function updateGallery() {
  const img = document.getElementById("modalImage");
  img.classList.remove("fade-in");
  void img.offsetWidth;
  img.src = currentImages[currentIndex];
  img.classList.add("fade-in");

  document.querySelectorAll(".thumb").forEach((t, i) => {
    t.classList.toggle("active-thumb", i === currentIndex);
  });

  document.querySelectorAll(".dot").forEach((d, i) => {
    d.classList.toggle("active-dot", i === currentIndex);
  });
}

function nextImage() {
  currentIndex = (currentIndex + 1) % currentImages.length;
  updateGallery();
}

function prevImage() {
  currentIndex =
    (currentIndex - 1 + currentImages.length) % currentImages.length;
  updateGallery();
}

function goToImage(index) {
  currentIndex = index;
  updateGallery();
}

function toggleZoom(img) {
  img.classList.toggle("zoomed");
}

function enableSwipe() {
  const img = document.getElementById("modalImage");

  img.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  img.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextImage();
    if (endX - startX > 50) prevImage();
  });
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

/* =========================
   PRODUCTFEATURED
========================= */


function renderFeaturedProducts() {
  const container = document.getElementById("featuredProducts");

const destacados = allProducts.filter(
  p => String(p.destacado).toLowerCase() === "true"
);

  if (destacados.length === 0) {
    container.style.display = "none";
    return;
  }

  container.innerHTML = "";

  destacados.forEach(product => {
    const firstImage = product.imagen.split("|")[0].trim();

    const card = document.createElement("div");
    card.className = "featured-card";

    card.innerHTML = `
      <img src="${firstImage}">
      <div class="featured-info">
        <h3>${product.nombre}</h3>
        <span>$${product.precio}</span>
      </div>
    `;

    card.addEventListener("click", () => openModal(product));
    container.appendChild(card);
  });
}

function scrollFeatured(direction) {
  const track = document.getElementById("featuredProducts");
  const scrollAmount = 320; 
  track.scrollBy({
    left: direction * scrollAmount,
    behavior: "smooth"
  });
}
