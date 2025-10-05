 // extend loadCart to support remove button


 
      function loadCart() {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        const tbody = document.getElementById("cart-body");
        const totalEl = document.getElementById("cart-total");
        if (!tbody) return;

        tbody.innerHTML = "";
        let totalCost = 0;

        cart.forEach((item, index) => {
          const price = Number(item.price) ;
          const quantity = item.quantity || 1;
          const subTotal = price * quantity;
          totalCost += subTotal;

          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td>
            <div class="cart-product">
              <img src="${item.image}" alt="${item.title}">
              <span>${item.title.slice(0, 40)}</span>
            </div>
          </td>
          <td>$${price.toFixed(2)}</td>
          <td> 
          <i class="fa-solid fa-angle-up add_item" ></i> 
          <input type="number" min="1" value="${quantity}"> 
          <i class="fa-solid fa-angle-down sub_item" ></i>
           </td>
          <td>$${subTotal.toFixed(2)}</td>
          <td><button class="remove-btn">
          <i class="fa-solid fa-xmark"></i></button></td>
        `;

          //   change quantity 
        const qtyInput = tr.querySelector("input");
        qtyInput.addEventListener("input", (e) => {
        let newQty = parseInt(e.target.value);

        if (newQty <= 0) {
          newQty = 1;
          e.target.value = 1; 
        }

    cart[index].quantity = newQty;
    localStorage.setItem("cart", JSON.stringify(cart));
    
    loadCart();
  });


          
        //   add and remove by icons 
        const add_icon = tr.querySelector(".add_item");
        const sub_icon = tr.querySelector(".sub_item");

        add_icon.addEventListener("click",()=>{
            cart[index].quantity += 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
        });

        sub_icon.addEventListener("click",()=>{
            if(cart[index].quantity>1){     
            cart[index].quantity -= 1;
       
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
            }
        });

            
      

          // remove item
          const removeBtn = tr.querySelector(".remove-btn");
          removeBtn.addEventListener("click", () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
          });
            tbody.appendChild(tr); 

        });

        totalEl.textContent = `$${totalCost.toFixed(2)}`;
      }

      document.addEventListener("DOMContentLoaded", loadCart);
    