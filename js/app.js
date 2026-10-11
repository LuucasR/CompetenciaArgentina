let allProducts = [];

const PRODUCTS_PER_PAGE = 12;
let currentPage = 1;

const SHEET_URL = "https://opensheet.elk.sh/1E9CVyFR-O3GbF9ITdN5M4SJo48q4U7kh3-ypAL9ss78/Sheet1";
const WHATSAPP_NUMBER = "541169233139";


/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderCart();
  fetchProducts();

  if (new URLSearchParams(window.location.search).has("carrito")) {
    openCart();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
    closeCart();
  }
});

/* =========================
   PRECIOS
========================= */

function precioConDescuento(precioBase, cantidad) {
  if (cantidad >= 5) return Math.floor(precioBase * 0.78);
  if (cantidad >= 3) return Math.floor(precioBase * 0.88);
  return precioBase;
}

function formatPrecio(n) {
  return "$" + Number(n).toLocaleString("es-AR");
}

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
  precio: parseFloat(row.precio) || 0,
  imagen: row.imagen?.trim(),
  caracteristicas: row.caracteristicas?.trim(),
  stock: row.stock?.trim(),
  destacado: row.destacado?.trim(),
  linea: row.linea?.trim(),
  categoria: row.categoria?.trim(),
  medidas: row.medidas?.trim() || ""
}));

    populateLineaFilter();
    renderProducts(allProducts, currentPage);
renderPagination(allProducts);
    renderFeaturedProducts(); 
  } catch (error) {
    console.error("Error cargando productos:", error);
    window.location.href = "../pages/error.php";
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

currentPage = 1;
renderProducts(filtered, currentPage);
renderPagination(filtered);
}

/* =========================
   RENDER PRODUCTOS
========================= */

function renderProducts(products, page = 1) {
    const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;

  const pageProducts = products.slice(start, end);

  pageProducts.forEach((product) => {

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
        <div class="price">${formatPrecio(product.precio)}</div>
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

  currentImages = (product.imagen || "")
    .split("|")
    .map(url => url.trim())
    .filter(url => url !== "");

  currentIndex = 0;

  let precioInicial = product.precio;
  let nombreMedidaInicial = "Única";

  let selectorMedidasHTML = "";

  /* =========================
     SELECTOR MEDIDAS
  ========================= */

  if (product.medidas && product.medidas !== "") {

    const medidasArray = product.medidas.split("|");

    const opciones = medidasArray.map((m, index) => {

      const partes = m.split(":");
      const nombre = partes[0]?.trim();
      const precio = parseFloat(partes[1]);

      if (index === 0) {
        precioInicial = precio;
        nombreMedidaInicial = nombre;
      }

      return `<option data-nombre="${nombre}" value="${precio}">${nombre}</option>`;
    }).join("");

    selectorMedidasHTML = `
      <div style="margin-bottom:15px;">
        <label><strong>Medida:</strong></label>
        <select id="sizeSelect" style="width:100%;padding:8px;border-radius:6px;margin-top:5px;">
          ${opciones}
        </select>
      </div>
    `;
  }

  /* =========================
     SELECTOR CANTIDAD
  ========================= */

  const cantidadHTML = `
    <div style="margin-bottom:15px;">
      <label><strong>Cantidad:</strong></label>
      <div style="display:flex;align-items:center;gap:10px;margin-top:5px;">
        <button id="menosBtn" type="button">-</button>
        <span id="cantidadValor">1</span>
        <button id="masBtn" type="button">+</button>
      </div>
    </div>
  `;

  body.innerHTML = `
<button class="modal-close" onclick="closeModal()">
  <span></span>
  <span></span>
</button>

<div class="modal-left">
  <div class="modal-gallery">
    <button class="nav-btn left" onclick="prevImage()">‹</button>
    <img id="modalImage" src="${currentImages[0]}" onclick="toggleZoom(this)"/>
    <button class="nav-btn right" onclick="nextImage()">›</button>
  </div>

  <div class="thumbnails">
    ${currentImages.map((img, i) => `
      <img src="${img}" 
           class="thumb ${i === 0 ? "active-thumb" : ""}" 
           onclick="goToImage(${i})">
    `).join("")}
  </div>
</div>

<div class="modal-right">

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
      ${selectorMedidasHTML}
      ${cantidadHTML}

      <div class="price-tier">
          <span>Precio unitario:</span>
          <strong id="precioUnitario">${formatPrecio(precioInicial)}</strong>
      </div>

      <div class="price-tier">
          <span>3 a 4 unidades (c/u):</span>
          <strong id="precioHasta3">${formatPrecio(precioConDescuento(precioInicial, 3))}</strong>
      </div>

      <div class="price-tier">
          <span>5 o más unidades (c/u):</span>
          <strong id="precioMas5">${formatPrecio(precioConDescuento(precioInicial, 5))}</strong>
      </div>

      <div class="price-tier price-subtotal">
          <span>Subtotal:</span>
          <strong id="precioSubtotal">${formatPrecio(precioInicial)}</strong>
      </div>
  </div>

  <div class="buy-options">
      <h3 class="buy-title">Canales de compra aqui</h3>
      <div class="buy-buttons">
          <button class="buy-btn cart" id="btnAgregarCarrito">
             🛒 Agregar al carrito
          </button>
          <button class="buy-btn whatsapp" id="btnComprar">
             Comprar ahora por WhatsApp
          </button>
      </div>
  </div>

</div>
`;

  /* =========================
     LÓGICA DINÁMICA
  ========================= */

  const sizeSelect = document.getElementById("sizeSelect");
  const cantidadSpan = document.getElementById("cantidadValor");
  const btnMas = document.getElementById("masBtn");
  const btnMenos = document.getElementById("menosBtn");

  let cantidad = 1;

  function calcularPrecioBase() {
    if (sizeSelect) {
      return parseFloat(sizeSelect.value);
    }
    return precioInicial;
  }

  function obtenerNombreMedida() {
    if (sizeSelect) {
      const selectedOption =
        sizeSelect.options[sizeSelect.selectedIndex];
      return selectedOption.getAttribute("data-nombre");
    }
    return nombreMedidaInicial;
  }

  function actualizarPrecios() {

    const precioBase = calcularPrecioBase();

    document.getElementById("precioUnitario").textContent =
      formatPrecio(precioBase);

    document.getElementById("precioHasta3").textContent =
      formatPrecio(precioConDescuento(precioBase, 3));

    document.getElementById("precioMas5").textContent =
      formatPrecio(precioConDescuento(precioBase, 5));

    document.getElementById("precioSubtotal").textContent =
      formatPrecio(precioConDescuento(precioBase, cantidad) * cantidad);
  }

  if (sizeSelect) {
    sizeSelect.addEventListener("change", actualizarPrecios);
  }

  btnMas.addEventListener("click", () => {
    cantidad++;
    cantidadSpan.textContent = cantidad;
    actualizarPrecios();
  });

  btnMenos.addEventListener("click", () => {
    if (cantidad > 1) {
      cantidad--;
      cantidadSpan.textContent = cantidad;
      actualizarPrecios();
    }
  });

  /* =========================
     BOTÓN CARRITO
  ========================= */

  document.getElementById("btnAgregarCarrito").addEventListener("click", () => {
    addToCart({
      id: product.id,
      nombre: product.nombre,
      medida: obtenerNombreMedida(),
      precioBase: calcularPrecioBase(),
      imagen: currentImages[0] || "",
      cantidad: cantidad
    });

    closeModal();
    openCart();
  });

  /* =========================
     BOTÓN WHATSAPP
  ========================= */

  document.getElementById("btnComprar").addEventListener("click", function () {

    const precioBase = calcularPrecioBase();
    const nombreMedida = obtenerNombreMedida();
    const total = precioConDescuento(precioBase, cantidad) * cantidad;

    const mensaje = `
Hola, quiero comprar ${product.nombre}
Medida: ${nombreMedida}
Cantidad: ${cantidad}
Total estimado: ${formatPrecio(total)}
`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank");
  });

  document.body.classList.add("modal-open");
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
  document.body.classList.remove("modal-open");
}

window.addEventListener("click", (event) => {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
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
    const firstImage = product.imagen
      ? product.imagen.split("|")[0].trim()
      : "";

    const card = document.createElement("div");
    card.className = "featured-card";

    card.innerHTML = `
      <img src="${firstImage}" alt="${product.nombre}">
      <div class="featured-info">
        <h3>${product.nombre}</h3>
        <span>${formatPrecio(product.precio)}</span>
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

function renderPagination(products) {

    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

    let pagination = document.getElementById("pagination");

    if (!pagination) {
        pagination = document.createElement("div");
        pagination.id = "pagination";
        pagination.className = "pagination";

        document.querySelector(".container").appendChild(pagination);
    }

    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        const btn = document.createElement("button");

        btn.textContent = i;

        if (i === currentPage)
            btn.classList.add("active");

        btn.onclick = () => {
            currentPage = i;
            renderProducts(products, currentPage);
            renderPagination(products);
            document.querySelector(".titlecatalogo")
                .scrollIntoView({ behavior: "smooth" });
        };

        pagination.appendChild(btn);
    }
}

/* =========================
   CARRITO
========================= */

const CART_STORAGE_KEY = "ca_cart";
let cart = [];

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));
    cart = Array.isArray(saved) ? saved : [];
  } catch (error) {
    cart = [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    // Sin storage el carrito funciona igual, solo no persiste
  }
}

function addToCart(item) {
  const key = item.id + "|" + item.medida;
  const existing = cart.find((i) => i.key === key);

  if (existing) {
    existing.cantidad += item.cantidad;
  } else {
    cart.push({ key, ...item });
  }

  saveCart();
  renderCart();
}

function updateCartQty(index, delta) {
  const item = cart[index];
  if (!item) return;

  item.cantidad += delta;
  if (item.cantidad < 1) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function clearCart() {
  cart = [];
  saveCart();
  renderCart();
}

function cartItemSubtotal(item) {
  return precioConDescuento(item.precioBase, item.cantidad) * item.cantidad;
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + cartItemSubtotal(item), 0);
}

function renderCart() {
  const itemsContainer = document.getElementById("cartItems");
  const badge = document.getElementById("cartBadge");
  if (!itemsContainer || !badge) return;

  const unidades = cart.reduce((sum, item) => sum + item.cantidad, 0);
  badge.textContent = unidades;
  badge.style.display = unidades > 0 ? "flex" : "none";

  const navCount = document.getElementById("navCartCount");
  if (navCount) navCount.textContent = unidades > 0 ? unidades : "";

  document.getElementById("cartTotal").textContent = formatPrecio(cartTotal());
  document.getElementById("cartSend").disabled = cart.length === 0;
  document.getElementById("cartClear").disabled = cart.length === 0;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p class="cart-empty">Tu carrito está vacío</p>`;
    return;
  }

  itemsContainer.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <img src="${item.imagen}" alt="${item.nombre}">
      <div class="cart-item-info">
        <h4>${item.nombre}</h4>
        <span class="cart-item-medida">Medida: ${item.medida}</span>
        <span class="cart-item-price">${formatPrecio(precioConDescuento(item.precioBase, item.cantidad))} c/u</span>
        <div class="cart-item-qty">
          <button type="button" data-action="menos" data-index="${index}">-</button>
          <span>${item.cantidad}</span>
          <button type="button" data-action="mas" data-index="${index}">+</button>
        </div>
      </div>
      <div class="cart-item-right">
        <strong>${formatPrecio(cartItemSubtotal(item))}</strong>
        <button type="button" class="cart-item-remove" data-action="eliminar" data-index="${index}">Eliminar</button>
      </div>
    </div>
  `).join("");
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  if (!drawer) return;

  drawer.classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  if (!drawer) return;

  drawer.classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.classList.remove("cart-open");
}

function sendCartToWhatsApp() {
  if (cart.length === 0) return;

  const lineas = cart.map((item, i) =>
    `${i + 1}) ${item.nombre} – Medida: ${item.medida} – Cant: ${item.cantidad} – ` +
    `${formatPrecio(precioConDescuento(item.precioBase, item.cantidad))} c/u – ` +
    `Subtotal ${formatPrecio(cartItemSubtotal(item))}`
  );

  const mensaje =
`Hola, quiero hacer el siguiente pedido:
${lineas.join("\n")}

Total estimado: ${formatPrecio(cartTotal())}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

document.addEventListener("click", (event) => {
  const btn = event.target.closest("#cartItems button[data-action]");
  if (!btn) return;

  const index = parseInt(btn.dataset.index, 10);

  if (btn.dataset.action === "mas") updateCartQty(index, 1);
  if (btn.dataset.action === "menos") updateCartQty(index, -1);
  if (btn.dataset.action === "eliminar") removeFromCart(index);
});
