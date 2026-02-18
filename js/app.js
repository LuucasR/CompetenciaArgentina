const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTPCrVMBxo2kPiM7vJqCKT0kFOtdX8iKQRJXESoIH3y03Zsbdwt_YEx0EWmh3AqTdDZSOVJUpfo89kC/pub?output=csv";
const WHATSAPP_NUMBER = "549XXXXXXXXXX";

let allProducts = [];

async function fetchProducts() {
  const response = await fetch(SHEET_URL);
  const data = await response.text();
  const rows = data.split("\n").slice(1);

  allProducts = rows.map(row => {
    const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
    if (!cols) return null;

    return {
      id: cols[0],
      nombre: cols[1],
      descripcion: cols[2],
      precio: cols[3],
      imagen: cols[4],
      caracteristicas: cols[5],
      stock: cols[6],
      destacado: cols[7],
      linea: cols[8],
      categoria: cols[9]
    };
  }).filter(Boolean);

  populateFilters();
  renderProducts(allProducts);
}

function populateFilters() {
  const lineaSet = new Set();
  const categoriaSet = new Set();

  allProducts.forEach(p => {
    lineaSet.add(p.linea);
    categoriaSet.add(p.categoria);
  });

  const lineaFilter = document.getElementById("lineaFilter");
  const categoriaFilter = document.getElementById("categoriaFilter");

  lineaSet.forEach(l => {
    lineaFilter.innerHTML += `<option value="${l}">${l}</option>`;
  });

  categoriaSet.forEach(c => {
    categoriaFilter.innerHTML += `<option value="${c}">${c}</option>`;
  });

  lineaFilter.addEventListener("change", applyFilters);
  categoriaFilter.addEventListener("change", applyFilters);
}

function applyFilters() {
  const lineaValue = document.getElementById("lineaFilter").value;
  const categoriaValue = document.getElementById("categoriaFilter").value;

  let filtered = allProducts;

  if (lineaValue !== "all")
    filtered = filtered.filter(p => p.linea === lineaValue);

  if (categoriaValue !== "all")
    filtered = filtered.filter(p => p.categoria === categoriaValue);

  renderProducts(filtered);
}

function renderProducts(products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${product.imagen}" alt="${product.nombre}">
      <div class="card-content">
        <h3>${product.nombre}</h3>
        <div class="price">$${product.precio}</div>
      </div>
    `;

    card.addEventListener("click", () => openModal(product));
    grid.appendChild(card);
  });
}

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
      href="https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero comprar " + product.nombre)}">
      Comprar por WhatsApp
    </a>
  `;

  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById("productModal").style.display = "none";
}

window.onclick = function(event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

fetchProducts();
