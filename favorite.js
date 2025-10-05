document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favorites_section");
  let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

  container.innerHTML = "";

  if (favorites.length === 0) {
    container.innerHTML = `
      <p> No favorites yet!  <i class="fa-solid fa-heart-crack"></i></p>`;
    return;
  }

  //  ==>        Render stars      <==
  function renderStars(rate) {
    const r = Math.round(rate);
    return Array.from({ length: 5 }, (_, i) =>
      i < r
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-solid fa-star" style="opacity:.25"></i>'
    ).join("");
  }

  // ==>        Create product card       <==
  function createProductCard(product) {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = product.id;

    // ==>     reloading     <==
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

    //  ==>      Favorite toggle       <==
    const favIcon = card.querySelector(".fav-icon");
    favIcon.addEventListener("click", () => {
      const container = document.getElementById("favorites_section");
      let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      favs = favs.filter((f) => f.id !== product.id);
      localStorage.setItem("favorites", JSON.stringify(favs));
      card.remove();


      if (favs.length === 0) {
        container.innerHTML = `
      <p>Now you don't have any favorite items <i class="fa-solid fa-heart-crack"></i></p>`;
        return;
      }
    });

    //         ==>       Cart toggle       <==
    const cartIcon = card.querySelector(".cart-icon");
    cartIcon.addEventListener("click", () => {
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((c) => c.id === product.id);

      if (existing) {
        cart = cart.filter((c) => c.id !== product.id);
        cartIcon.classList.remove("active");
      } else {
        cart.push({ ...product, quantity: 1 });
        cartIcon.classList.add("active");
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });

    return card;
  }

  favorites.forEach((product) => {
    container.appendChild(createProductCard(product));
  });
});
