// ================================
// SLIDER (Hero images with interval)
// ================================
(function slider() {
  const slideImages = [
    "assets/Frame_560.png",
    "assets/Frame_684.png",
    "assets/Frame_600.png",
  ];

  const slideImg = document.getElementById("slides");
  let index = 0;

  if (slideImg) {
    setInterval(() => {
      index = (index + 1) % slideImages.length;
      slideImg.src = slideImages[index];
    }, 1500);
  }
})();

// ================================
// NAVBAR TOGGLE (mobile menu)
// ================================
(function navbarToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const linksEl = document.querySelector(".links");
  const nav = document.querySelector(".nav_bar");

  if (!menuToggle || !linksEl || !nav) return;

  menuToggle.addEventListener("click", () => {
    linksEl.classList.toggle("show");

    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!linksEl.classList.contains("show")) return;
    if (!nav.contains(e.target)) {
      linksEl.classList.remove("show");

      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark ");
        icon.classList.add("fa-bars");
      }
    }
  });
})();

// ================================
// PRODUCTS SECTION
// ================================
const productsContainer = document.getElementById("products_section");
const displayedIds = new Set();

// Render stars for rating
function renderStars(rate) {
  const r = Math.round(rate || 0);
  return Array.from({ length: 5 }, (_, i) =>
    i < r
      ? '<i class="fa-solid fa-star"></i>'
      : '<i class="fa-solid fa-star" style="opacity:.25"></i>'
  ).join("");
}

// Create product card
function createCard(product) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = product.id;

  card.innerHTML = `
    <div class="card_img">
      <img src="${product.image}" alt="${(product.title || "").replace(
    /"/g,
    "&quot;"
  )}" />
    </div>

    <div class="card_icons">
      <i class="fa-regular fa-heart fav-icon" title="Favorite"></i>
      <i class="fa-solid fa-cart-shopping cart-icon" title="Add to cart"></i>
    </div>

    <div class="card_info">
      <h4>${(product.title || "").slice(0, 60)}</h4>
      <p class="price">$${Number(product.price).toFixed(2)}</p>
      <div class="rating">
        ${renderStars(product.rating?.rate)}
        <span class="discription">(${product.rating?.count || 0})</span>
      </div>
    </div>
  `;

  const favIcon = card.querySelector(".fav-icon");
  const cartIcon = card.querySelector(".cart-icon");

  // Initial state from localStorage
  try {
    const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favs.some((p) => p.id === product.id)) favIcon.classList.add("active");

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.some((p) => p.id === product.id)) cartIcon.classList.add("active");
  } catch {
    /* ignore parse errors */
  }

  // Favorite toggle
  favIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    favIcon.classList.toggle("active");

    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favIcon.classList.contains("active")) {
      favs.push(product);
    } else {
      favs = favs.filter((p) => p.id !== product.id);
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
  });

  // Cart toggle
  cartIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    cartIcon.classList.toggle("active");

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (cartIcon.classList.contains("active")) {
      const existing = cart.find((p) => p.id === product.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
    } else {
      cart = cart.filter((p) => p.id !== product.id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  });

  return card;
}

// Add products to container
function addProducts(list) {
  list.forEach((p) => {
    if (displayedIds.has(p.id)) return;
    productsContainer.appendChild(createCard(p));
    displayedIds.add(p.id);
  });
}

// ================================
// CATEGORY FILTER
// ================================
(function categoryFilter() {
  const catCards = document.querySelectorAll(".cat_card");
  if (!catCards.length) return;

  catCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Reset active class
      catCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      // Get category
      const category = card.querySelector("p").innerText.toLowerCase();

      // Clear current products
      productsContainer.innerHTML = "";
      displayedIds.clear();

      // Fetch category products
      fetch(`https://fakestoreapi.com/products/category/${category}`)
        .then((res) => res.json())
        .then(addProducts)
        .catch((err) => console.error("Category fetch error:", err));
    });
  });
})();

// Initial fetch (8 products)
fetch("https://fakestoreapi.com/products?limit=8")
  .then((res) => res.json())
  .then(addProducts)
  .catch((err) => console.error("Products fetch error:", err));

// View all button
const viewAllBtn = document.getElementById("view-all");
if (viewAllBtn) {
  const catCards = document.querySelectorAll(".cat_card"); // get active filter to remove

  viewAllBtn.addEventListener("click", () => {
    productsContainer.innerHTML = "";
    displayedIds.clear();
    catCards.forEach((c) => c.classList.remove("active")); //remove cat selection if any (bg-color)
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then(addProducts)
      .catch((err) => console.error("View all fetch error:", err));
  });
}

// "Start Shopping" button
const shopBtn = document.getElementById("shopping");
const productsAnchor = document.getElementById("products");
if (shopBtn && productsAnchor) {
  shopBtn.addEventListener("click", () => {
    productsAnchor.scrollIntoView({ behavior: "smooth" });
  });
}

// ================================
// SEARCH FILTER
// ================================
(function searchFilter() {
  const searchInput = document.querySelector(".searchbar input");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();
    const cards = productsContainer.querySelectorAll(".card");

    cards.forEach((card) => {
      const title = card.querySelector("h4").innerText.toLowerCase();
      card.style.display = title.includes(keyword) ? "flex" : "none";
    });
  });
})();
