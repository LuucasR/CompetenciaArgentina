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
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.imagen}" alt="${product.nombre}" loading="lazy">
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

function openModal(product) {
  const modal = document.getElementById("productModal");
  const body = document.getElementById("modalBody");

  body.innerHTML = `
    <span class="close" onclick="closeModal()">X</span>
    <img src="${product.imagen}">
    <h2>${product.nombre}</h2>
    <p>${product.descripcion}</p>
    <div class="price">$${product.precio}</div>
    <p>${product.caracteristicas}</p>
    <a class="btn" target="_blank"
      href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        "Hola, quiero comprar " + product.nombre
      )}">
      Comprar por WhatsApp
    </a>
  `;

  modal.style.display = "flex";
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
