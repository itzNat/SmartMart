// Cart data
let cart = [
  {
    id: 1,
    name: "Quantum X Earbuds",
    price: 89.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
  },
  {
    id: 2,
    name: "Ultra HD Smart TV",
    price: 899.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    id: 4,
    name: "Smart Home Hub",
    price: 249.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
];

// Wishlist data
let wishlist = [3]; // Product ID 3 is in wishlist initially
// Wishlist functionality
const wishlistToggle = document.getElementById("wishlist-toggle");
const wishlistClose = document.getElementById("wishlist-close");
const wishlistSidebar = document.getElementById("wishlist-sidebar");
const wishlistItemsContainer = document.getElementById("wishlist-items");

// Toggle wishlist sidebar
wishlistToggle.addEventListener("click", () => {
  wishlistSidebar.classList.remove("translate-x-full");
  updateWishlistDisplay();
});

wishlistClose.addEventListener("click", () => {
  wishlistSidebar.classList.add("translate-x-full");
});

// Close wishlist when clicking outside
document.addEventListener("click", (e) => {
  if (
    !wishlistSidebar.contains(e.target) &&
    e.target !== wishlistToggle &&
    !wishlistToggle.contains(e.target)
  ) {
    wishlistSidebar.classList.add("translate-x-full");
  }
});

// Continue shopping button
document
  .getElementById("continue-shopping-wishlist")
  .addEventListener("click", () => {
    wishlistSidebar.classList.add("translate-x-full");
  });

// Update wishlist display
function updateWishlistDisplay() {
  const wishlistCount = wishlist.length;
  document.getElementById("wishlist-count").textContent = wishlistCount;

  // Update heart icon in navbar based on wishlist count
  const navbarWishlistIcon = document.querySelector("#wishlist-toggle i");
  if (wishlistCount > 0) {
    navbarWishlistIcon.classList.remove("far", "fa-heart");
    navbarWishlistIcon.classList.add(
      "fas",
      "fa-heart",
      "text-secondary-light",
      "dark:text-secondary-dark"
    );
  } else {
    navbarWishlistIcon.classList.remove(
      "fas",
      "fa-heart",
      "text-secondary-light",
      "dark:text-secondary-dark"
    );
    navbarWishlistIcon.classList.add("far", "fa-heart");
  }

  // Clear current wishlist items
  wishlistItemsContainer.innerHTML = "";

  // Add current wishlist items
  if (wishlist.length === 0) {
    wishlistItemsContainer.innerHTML =
      '<p class="text-center py-4">Your wishlist is empty</p>';
    return;
  }

  // Find all products that are in wishlist
  const allProducts = document.querySelectorAll(".product-card");

  wishlist.forEach((productId) => {
    const productCard = Array.from(allProducts).find(
      (card) => parseInt(card.dataset.id) === productId
    );
    if (productCard) {
      const productName = productCard.dataset.name;
      const productPrice = productCard.dataset.price;
      const productImage = productCard.querySelector("img").src;

      const wishlistItem = document.createElement("div");
      wishlistItem.className =
        "wishlist-item flex items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg";
      wishlistItem.dataset.id = productId;

      wishlistItem.innerHTML = `
        <div class="w-20 h-20 rounded-md overflow-hidden mr-4">
          <img src="${productImage}" alt="${productName}" class="w-full h-full object-cover">
        </div>
        <div class="flex-grow">
          <h3 class="font-medium">${productName}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">${
            productCard.querySelector("p").textContent
          }</p>
          <div class="flex justify-between items-center mt-1">
            <span class="font-medium">$${productPrice}</span>
            <button class="move-to-cart px-4 py-1 bg-primary-light dark:bg-primary-dark text-white text-sm rounded-full font-medium hover:opacity-90">
              Add to Cart
            </button>
          </div>
        </div>
        <button class="remove-from-wishlist ml-4 text-gray-400 hover:text-secondary-light dark:hover:text-secondary-dark">
          <i class="far fa-trash-alt"></i>
        </button>
      `;

      wishlistItemsContainer.appendChild(wishlistItem);
    }
  });

  // Add event listeners to new wishlist items
  document.querySelectorAll(".remove-from-wishlist").forEach((button) => {
    button.addEventListener("click", (e) => {
      const wishlistItem = e.target.closest(".wishlist-item");
      const itemId = parseInt(wishlistItem.dataset.id);

      // Remove from wishlist
      wishlist = wishlist.filter((id) => id !== itemId);

      // Update product card heart icon
      const productCard = document.querySelector(
        `.product-card[data-id="${itemId}"]`
      );
      if (productCard) {
        const wishlistBtn = productCard.querySelector(".wishlist-btn");
        wishlistBtn.innerHTML =
          '<i class="far fa-heart text-gray-600 dark:text-gray-300"></i>';
      }

      // Update display
      updateWishlistDisplay();
    });
  });

  // Add to cart buttons in wishlist
  document.querySelectorAll(".move-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const wishlistItem = e.target.closest(".wishlist-item");
      const itemId = parseInt(wishlistItem.dataset.id);
      const productCard = document.querySelector(
        `.product-card[data-id="${itemId}"]`
      );

      if (productCard) {
        const productName = productCard.dataset.name;
        const productPrice = parseFloat(productCard.dataset.price);
        const productImage = productCard.querySelector("img").src;

        // Check if product already in cart
        const existingItem = cart.find((item) => item.id === itemId);

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: itemId,
            name: productName,
            price: productPrice,
            quantity: 1,
            image: productImage,
          });
        }

        updateCartDisplay();
        alert(`${productName} has been added to your cart!`);
      }
    });
  });
}

// Initialize wishlist display
updateWishlistDisplay();
// Calculate cart totals
function calculateCartTotals() {
  let subtotal = 0;
  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
  });
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return {
    subtotal: subtotal.toFixed(2),
    tax: tax.toFixed(2),
    total: total.toFixed(2),
  };
}

// Update cart display
function updateCartDisplay() {
  const totals = calculateCartTotals();

  // Update cart count
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = cartCount;
  document.getElementById("cart-count-display").textContent = cartCount;

  // Update totals
  document.getElementById("subtotal").textContent = totals.subtotal;
  document.getElementById("tax").textContent = totals.tax;
  document.getElementById("total").textContent = totals.total;

  // Update checkout modal totals
  document.getElementById("checkout-subtotal").textContent = totals.subtotal;
  document.getElementById("checkout-tax").textContent = totals.tax;
  document.getElementById("checkout-total").textContent = totals.total;
}

// Initialize cart display
updateCartDisplay();

// Dark mode toggle
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    html.classList.contains("dark") ? "dark" : "light"
  );
});

// Set initial theme based on localStorage or prefer-color-scheme
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  html.classList.add("dark");
}

// Cart sidebar toggle
const cartToggle = document.getElementById("cart-toggle");
const cartClose = document.getElementById("cart-close");
const cartSidebar = document.getElementById("cart-sidebar");

cartToggle.addEventListener("click", () => {
  cartSidebar.classList.remove("translate-x-full");
});

cartClose.addEventListener("click", () => {
  cartSidebar.classList.add("translate-x-full");
});

// Close cart when clicking outside
document.addEventListener("click", (e) => {
  if (
    !cartSidebar.contains(e.target) &&
    e.target !== cartToggle &&
    !cartToggle.contains(e.target)
  ) {
    cartSidebar.classList.add("translate-x-full");
  }
});

// Continue shopping button
document
  .getElementById("continue-shopping-btn")
  .addEventListener("click", () => {
    cartSidebar.classList.add("translate-x-full");
  });

// Add to cart functionality
document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const productCard = e.target.closest(".product-card");
    const productId = parseInt(productCard.dataset.id);
    const productName = productCard.dataset.name;
    const productPrice = parseFloat(productCard.dataset.price);
    const productImage = productCard.querySelector("img").src;

    // Check if product already in cart
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
        image: productImage,
      });
    }

    updateCartDisplay();

    // Show cart sidebar
    cartSidebar.classList.remove("translate-x-full");

    // Show success message
    alert(`${productName} has been added to your cart!`);
  });
});

// Wishlist functionality
document.querySelectorAll(".wishlist-btn").forEach((button) => {
  const productId = parseInt(button.dataset.id);

  // Update heart icon based on wishlist status
  if (wishlist.includes(productId)) {
    button.innerHTML =
      '<i class="fas fa-heart text-secondary-light dark:text-secondary-dark"></i>';
  }

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    const productCard = e.target.closest(".product-card");
    const productName = productCard.dataset.name;

    if (wishlist.includes(productId)) {
      // Remove from wishlist
      wishlist = wishlist.filter((id) => id !== productId);
      button.innerHTML =
        '<i class="far fa-heart text-gray-600 dark:text-gray-300"></i>';
      alert(`${productName} removed from wishlist`);
    } else {
      // Add to wishlist
      wishlist.push(productId);
      button.innerHTML =
        '<i class="fas fa-heart text-secondary-light dark:text-secondary-dark"></i>';
      alert(`${productName} added to wishlist`);
    }

    // Update wishlist display
    updateWishlistDisplay();
  });
});
// Cart item quantity controls
document.addEventListener("click", (e) => {
  // Increase quantity
  if (
    e.target.classList.contains("increase-qty") ||
    e.target.parentElement.classList.contains("increase-qty")
  ) {
    const button = e.target.classList.contains("increase-qty")
      ? e.target
      : e.target.parentElement;
    const cartItem = button.closest(".cart-item");
    const itemId = parseInt(cartItem.dataset.id);
    const quantityElement = cartItem.querySelector(".quantity");

    const item = cart.find((item) => item.id === itemId);
    if (item) {
      item.quantity += 1;
      quantityElement.textContent = item.quantity;
      updateCartDisplay();
    }
  }

  // Decrease quantity
  if (
    e.target.classList.contains("decrease-qty") ||
    e.target.parentElement.classList.contains("decrease-qty")
  ) {
    const button = e.target.classList.contains("decrease-qty")
      ? e.target
      : e.target.parentElement;
    const cartItem = button.closest(".cart-item");
    const itemId = parseInt(cartItem.dataset.id);
    const quantityElement = cartItem.querySelector(".quantity");

    const item = cart.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      quantityElement.textContent = item.quantity;
      updateCartDisplay();
    }
  }

  // Remove item
  if (
    e.target.classList.contains("remove-item") ||
    e.target.parentElement.classList.contains("remove-item")
  ) {
    const button = e.target.classList.contains("remove-item")
      ? e.target
      : e.target.parentElement;
    const cartItem = button.closest(".cart-item");
    const itemId = parseInt(cartItem.dataset.id);

    cart = cart.filter((item) => item.id !== itemId);
    cartItem.remove();
    updateCartDisplay();

    if (cart.length === 0) {
      document.getElementById("cart-items").innerHTML =
        '<p class="text-center py-4">Your cart is empty</p>';
    }
  }
});

// Checkout functionality
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutClose = document.getElementById("checkout-close");

checkoutBtn.addEventListener("click", () => {
  cartSidebar.classList.add("translate-x-full");
  checkoutModal.style.display = "flex";
});

checkoutClose.addEventListener("click", () => {
  checkoutModal.style.display = "none";
});

// Close checkout modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === checkoutModal) {
    checkoutModal.style.display = "none";
  }
});

// Payment method selection
const paymentMethods = document.querySelectorAll(
  'input[name="payment-method"]'
);
const creditCardForm = document.getElementById("credit-card-form");

paymentMethods.forEach((method) => {
  method.addEventListener("change", (e) => {
    if (e.target.value === "credit-card") {
      creditCardForm.style.display = "block";
    } else {
      creditCardForm.style.display = "none";
    }
  });
});

// Place order functionality
const checkoutForm = document.getElementById("checkout-form");
const successModal = document.getElementById("success-modal");
const continueShoppingSuccess = document.getElementById(
  "continue-shopping-success"
);

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkoutModal.style.display = "none";
  successModal.style.display = "flex";

  // Clear cart after successful order
  cart = [];
  updateCartDisplay();
  document.getElementById("cart-items").innerHTML =
    '<p class="text-center py-4">Your cart is empty</p>';
});

continueShoppingSuccess.addEventListener("click", () => {
  successModal.style.display = "none";
});

document.getElementById("view-order-btn").addEventListener("click", () => {
  successModal.style.display = "none";
  alert("Order details would be shown here in a real implementation.");
});

// View all products button
document.getElementById("view-all-btn").addEventListener("click", () => {
  alert("This would show all products in a real implementation.");
});

// Support button
document.getElementById("support-btn").addEventListener("click", () => {
  alert("Contact support at support@smartmart.com or call 1-800-SMART-MART");
});

// Subscribe button
document.getElementById("subscribe-btn").addEventListener("click", () => {
  const email = document.getElementById("newsletter-email").value;
  if (email && email.includes("@")) {
    alert(
      `Thank you for subscribing with ${email}! You'll receive our newsletter soon.`
    );
    document.getElementById("newsletter-email").value = "";
  } else {
    alert("Please enter a valid email address.");
  }
});

// Shop now button
document.getElementById("shop-now-btn").addEventListener("click", () => {
  window.location.href = "#shop";
});

// Explore button
document.getElementById("explore-btn").addEventListener("click", () => {
  window.location.href = "#collections";
});
