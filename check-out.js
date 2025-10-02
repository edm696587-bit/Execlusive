    function loadCheckout() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const orderList = document.getElementById("order-list");
      const subtotalEl = document.getElementById("subtotal");
      const totalEl = document.getElementById("total");

      orderList.innerHTML = "";
      let subtotal = 0;

      cart.forEach((item) => {
        const li = document.createElement("li");
        const price = Number(item.price) * (item.quantity || 1);
        const quantity = Number(item.quantity || 1);
        li.innerHTML = `
          <span>${item.title.slice(0, 20)}</span>
          <span>x${quantity}</span>
          <span>$${price.toFixed(2)}</span>
        `;
        orderList.appendChild(li);
        subtotal += price;
      });

      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
      totalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    document.addEventListener("DOMContentLoaded", loadCheckout);

    // Place order
    document.getElementById("place-order").addEventListener("click", () => {
      const name = document.getElementById("name").value.trim();
      const address = document.getElementById("address").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");

      // Validate cart
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      // Validate name (must be 2+ words)
      if (name.split(" ").length < 2) {
        alert("Please enter your full name (at least 2 words).\n");
        return;
      }

      // Validate address (must be 2+ words)
      if (address.split(" ").length < 2) {
        alert("Please enter a valid address (at least 2 words).\n");
        return;
      }

      // Validate phone (must be 11 digits & not all same)
      if (!/^\d{11}$/.test(phone)) {
        alert("Phone number must contain exactly 11 digits.");
        return;
      }
      if (/^(\d)\1{10}$/.test(phone)) {
        alert("Phone number cannot be all the same digit.");
        return;
      }

      alert(`Order placed successfully!\nName: ${name}\nAddress: ${address}\nPhone: ${phone}`);

      // Clear cart
      localStorage.removeItem("cart");
      document.getElementById("order-list").innerHTML = "";
      document.getElementById("subtotal").textContent = "$0";
      document.getElementById("total").textContent = "$0";
      // clear form
      document.getElementById("name").value = "";
      document.getElementById("address").value = "";  
      document.getElementById("phone").value = "";
      document.getElementById("coupon-code").value = "";
      couponUsed = flase

      loadCheckout();
    });

    // Valid coupons logic
    const valid_coupons = {
      AAAA: 100,
      BBBB: 200,
      CCCC: 50,
      DDDD: 20,
    };

    let couponUsed = false;
    const couponInput = document.getElementById("coupon-code");
    const applyBtn = document.getElementById("apply-coupon");

    applyBtn.addEventListener("click", () => {
      if (couponUsed) {
        alert("***** متشغلهاش *******");
        return;
      }

      const coupon = couponInput.value.toUpperCase();
      const totalEl = document.getElementById("total");
      let currentTotal = parseFloat(totalEl.textContent.replace("$", "")) || 0;

      if (valid_coupons[coupon] && currentTotal > 0) {
        let newTotal = Math.max(0, currentTotal - valid_coupons[coupon]);
        totalEl.textContent = `$${newTotal.toFixed(2)}`;
        couponInput.value = "";
        couponUsed = true;

        alert(`Congratulations! You got $${valid_coupons[coupon]} discount with code "${coupon}"`);
      } else if (currentTotal === 0) {
        alert("Your cart is empty!");
      } else {
        alert("Invalid coupon code.");
      }
    });