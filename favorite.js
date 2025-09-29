// ================================
// FAVORITES PAGE SCRIPT
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites_section");
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML =
      "<p style='text-align:center;'>No favorites yet.</p>";
    return;
  }

  // Render stars
  function renderStars(rate) {
    const r = Math.round(rate || 0);
    return Array.from({ length: 5 }, (_, i) =>
      i < r
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-solid fa-star" style="opacity:.25"></i>'
    ).join("");
  }

  // Create product card
  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = product.id;

    // Load current state
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isInCart = cart.some((c) => c.id === product.id);

    card.innerHTML = `
      <div class="card_img">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="card_icons">
        <i class="fa-solid fa-heart fav-icon active" title="Remove Favorite"></i>
        <i class="fa-solid fa-cart-shopping cart-icon ${
          isInCart ? "active" : ""
        }" title="Toggle Cart"></i>
      </div>
      <div class="card_info">
        <h4>${product.title.slice(0, 60)}</h4>
        <p class="price">$${Number(product.price).toFixed(2)}</p>
        <div class="rating">
          ${renderStars(product.rating?.rate)}
          <span class="discription">(${product.rating?.count || 0})</span>
        </div>
      </div>
    `;

    // Favorite toggle
    const favIcon = card.querySelector(".fav-icon");
    favIcon.addEventListener("click", () => {
      let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      favs = favs.filter((f) => f.id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(favs));
      card.remove(); // remove from UI
    });

    // Cart toggle (ADD if not in cart, REMOVE if in cart)
    const cartIcon = card.querySelector(".cart-icon");
    cartIcon.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((c) => c.id === product.id);

      if (existing) {
        // REMOVE product if already in cart
        cart = cart.filter((c) => c.id !== product.id);
        cartIcon.classList.remove("active");
      } else {
        // ADD product with quantity 1
        cart.push({ ...product, quantity: 1 });
        cartIcon.classList.add("active");
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });

    return card;
  }

  // Render all favorites
  favorites.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
});
