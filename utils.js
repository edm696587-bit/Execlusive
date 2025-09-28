// Render stars
function renderStars(rate) {
  const r = Math.round(rate || 0);
  return Array.from({ length: 5 }, (_, i) =>
    i < r
      ? '<i class="fa-solid fa-star"></i>'
      : '<i class="fa-solid fa-star" style="opacity:.25"></i>'
  ).join("");
}

// Create a product card
function createProductCard(product, favorites, cart) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = product.id;

  // check if product in favorites
  const isFav = favorites.some((f) => f.id === product.id);
  const isInCart = cart.some((c) => c.id === product.id);

  card.innerHTML = `
    <div class="card_img">
      <img src="${product.image}" alt="${product.title}">
    </div>
    <div class="card_icons">
      <i class="fa-solid fa-heart fav-icon ${
        isFav ? "active" : ""
      }" title="Toggle Favorite"></i>
      <i class="fa-solid fa-cart-shopping cart-icon ${
        isInCart ? "active" : ""
      }" title="Add to Cart"></i>
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

  // Fav toggle from fave page
  const favIcon = card.querySelector(".fav-icon");
  favIcon.addEventListener("click", () => {
    let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (favs.some((f) => f.id === product.id)) {
      favs = favs.filter((f) => f.id !== product.id);
      favIcon.classList.remove("active");

      // ---------------- remove card if on favorites page ----------------
      if (window.location.pathname.includes("favorite.html")) {
        card.remove();
      }
    } else {
      favs.push(product);
      favIcon.classList.add("active");
    }
    localStorage.setItem("favorites", JSON.stringify(favs));
  });

  // Add to cart
  const cartIcon = card.querySelector(".cart-icon");
  cartIcon.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    cartIcon.classList.add("active");
  });

  return card;
}
