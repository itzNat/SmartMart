import { ProductsManager } from "./products.js";
import { CartManager } from "./cart.js";
import { WishlistManager } from "./wishlist.js";
import { UIManager } from "./ui.js";
import { CheckoutManager } from "./checkout.js";
import { categoryTags, getTagName, formatCategory } from "./constants.js";

class App {
  constructor() {
    this.productsManager = new ProductsManager();
    this.cartManager = new CartManager();
    this.wishlistManager = new WishlistManager();
    this.checkoutManager = new CheckoutManager(this.cartManager);

    this.init();
  }

  async init() {
    await this.productsManager.fetchData();
    this.setupEventListeners();
    UIManager.renderSortBy();
    this.checkoutManager.init();
    this.updateTagFilterOptions("all");
  }

  setupEventListeners() {
    this.renderProducts();
    // Search functionality
    document
      .getElementById("search-input")
      .addEventListener("input", this.handleSearch.bind(this));
    document
      .getElementById("mobile-search-input")
      .addEventListener("input", this.handleSearch.bind(this));

    // Filter and sort
    document
      .getElementById("tag-filter")
      .addEventListener("change", this.handleTagFilter.bind(this));
    document
      .getElementById("sort-by")
      .addEventListener("change", this.handleSortChange.bind(this));

    // View toggle
    document
      .getElementById("grid-view")
      .addEventListener("click", () => this.toggleView("grid"));
    document
      .getElementById("list-view")
      .addEventListener("click", () => this.toggleView("list"));

    // Category sidebar
    document.querySelectorAll(".sidebar-item").forEach((item) => {
      item.addEventListener("click", () => {
        const category = item.getAttribute("data-category");
        this.handleCategoryFilter(category);
      });
    });

    // Cart functionality
    this.cartManager.updateCart();
    this.cartManager.setupCartEventListeners();

    // Wishlist functionality
    this.wishlistManager.setupWishlistEventListeners(
      this.cartManager,
      this.productsManager.productsData
    );

    // Product buttons (added when products are rendered)
    document.addEventListener("click", (e) => {
      if (e.target.closest(".add-to-cart")) {
        const id = e.target.getAttribute("data-id");
        const name = e.target.getAttribute("data-name");
        const price = e.target.getAttribute("data-price");
        const image = e.target.getAttribute("data-image");
        this.cartManager.addToCart(id, name, price, image);
        UIManager.showConfetti();
        UIManager.cartIconBounce();
      }

      if (e.target.closest(".wishlist-btn")) {
        e.stopPropagation();
        const id = e.target.closest("button").getAttribute("data-id");
        this.wishlistManager.toggleWishlist(
          Number(id),
          this.productsManager.productsData
        );
      }
    });

    // Close with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (
          document.getElementById("cart-sidebar").classList.contains("open")
        ) {
          this.cartManager.closeCartSidebar();
        }
        if (
          document.getElementById("wishlist-sidebar").classList.contains("open")
        ) {
          this.wishlistManager.closeWishlistSidebar();
        }
      }
    });
  }

  handleSearch(e) {
    this.productsManager.currentSearch = e.target.value.toLowerCase();
    this.productsManager.currentPage = 1;
    this.renderProducts();
  }

  handleTagFilter(e) {
    this.productsManager.currentTag = e.target.value;
    this.productsManager.currentPage = 1;
    this.renderProducts();
  }

  handleSortChange(e) {
    this.productsManager.currentSort = e.target.value;
    this.renderProducts();
  }

  handleCategoryFilter(category) {
    this.productsManager.currentCategory = category;
    this.productsManager.currentPage = 1;
    this.productsManager.currentTag = "all";

    // Update active state in sidebar
    document.querySelectorAll(".sidebar-item").forEach((item) => {
      item.classList.remove("active");
      if (item.getAttribute("data-category") === category) {
        item.classList.add("active");
      }
    });

    // Update tag filter options based on category
    this.updateTagFilterOptions(category);

    this.renderProducts();
  }

  updateTagFilterOptions(category) {
    console.log(category);
    const tags = categoryTags[category] || categoryTags.all;
    const tagFilter = document.getElementById("tag-filter");
    tagFilter.innerHTML = "";

    // Add "All Tags" option
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "All Tags";
    tagFilter.appendChild(allOption);

    // Add category-specific tags
    const customSelect = document.querySelector(".custom-tag-select");
    const optionsContainer = customSelect.querySelector(".options");
    const selectedText = customSelect.querySelector(".selected-text");
    selectedText.textContent = "All Tags";
    optionsContainer.innerHTML = "";

    tags.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag;
      option.textContent = getTagName(tag);
      tagFilter.appendChild(option);

      // Add to custom dropdown
      const optionElement = document.createElement("div");
      optionElement.className =
        "option px-4 py-2 text-sm text-dark-800 hover:bg-indigo-50 cursor-pointer transition-colors";
      optionElement.dataset.value = tag;

      optionElement.innerHTML = `
        <div class="flex items-center">
          <span>${tag === "all" ? "All Tags" : getTagName(tag)}</span>
          <svg class="ml-auto w-4 h-4 text-primary hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      `;

      optionsContainer.appendChild(optionElement);
    });

    // Toggle dropdown
    customSelect
      .querySelector(".selected-option")
      .addEventListener("click", function () {
        customSelect.classList.add("active");
      });

    // Select option
    optionsContainer.addEventListener("click", function (e) {
      const option = e.target.closest(".option");
      if (!option) return;

      const value = option.dataset.value;
      const text = option.querySelector("span").textContent;

      // Update UI
      selectedText.textContent = text;
      document
        .querySelectorAll(".custom-tag-select .option")
        .forEach((opt) => opt.classList.remove("active"));
      option.classList.add("active");

      // Update hidden select
      tagFilter.value = value;
      tagFilter.dispatchEvent(new Event("change"));

      // Close dropdown
      customSelect.classList.remove("active");
    });

    // Close when clicking outside
    document.addEventListener("click", function (e) {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("active");
      }
    });

    // Initialize selected option
    const initialValue = tagFilter.value;
    document
      .querySelector(`.custom-tag-select .option[data-value="${initialValue}"]`)
      .classList.add("active");
  }

  toggleView(view) {
    this.productsManager.currentView = view;

    // Update active state of view buttons
    if (view === "grid") {
      document.getElementById("grid-view").classList.add("active-view");
      document.getElementById("list-view").classList.remove("active-view");
      document
        .getElementById("products-container")
        .classList.remove("products-list-view");
      document
        .getElementById("products-container")
        .classList.add(
          "grid",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4",
          "gap-6"
        );
    } else {
      document.getElementById("grid-view").classList.remove("active-view");
      document.getElementById("list-view").classList.add("active-view");
      document
        .getElementById("products-container")
        .classList.remove(
          "grid",
          "grid-cols-1",
          "sm:grid-cols-2",
          "lg:grid-cols-3",
          "xl:grid-cols-4",
          "gap-6"
        );
      document
        .getElementById("products-container")
        .classList.add("products-list-view");
    }

    this.renderProducts();
  }

  renderProducts() {
    const filteredProducts = this.productsManager.getFilteredProducts();
    const totalPages = Math.ceil(
      filteredProducts.length / this.productsManager.productsPerPage
    );

    // Calculate products for current page
    const startIndex =
      (this.productsManager.currentPage - 1) *
      this.productsManager.productsPerPage;
    const endIndex = startIndex + this.productsManager.productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    // Clear container
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";

    // Render products
    if (productsToShow.length === 0) {
      productsContainer.innerHTML = `
        <div class="col-span-full text-center py-12">
          <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-medium mb-2">No products found</h3>
          <p class="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      `;
    } else {
      productsToShow.forEach((product) => {
        const isInWishlist = this.wishlistManager.wishlist.some(
          (item) => item.id === product.id
        );
        const productElement = document.createElement("div");
        productElement.innerHTML = this.productsManager.createProductElement(
          product,
          isInWishlist
        );
        productsContainer.appendChild(productElement);
      });
    }

    // Render pagination
    this.renderPagination(filteredProducts.length, totalPages);
  }

  renderPagination(totalProducts, totalPages) {
    if (totalProducts <= this.productsManager.productsPerPage) {
      document.getElementById("pagination-wrapper").classList.add("hidden");
      document.getElementById("pagination").innerHTML = "";
      return;
    }

    let paginationHTML = "";
    document.getElementById("pagination-wrapper").classList.remove("hidden");

    // Previous button
    paginationHTML += `
      <button class="pagination-prev w-8 h-8 rounded-full glass-dark flex items-center justify-center ${
        this.productsManager.currentPage === 1
          ? "opacity-50 cursor-not-allowed"
          : ""
      }" ${this.productsManager.currentPage === 1 ? "disabled" : ""}>
        <i class="fas fa-chevron-left text-xs"></i>
      </button>
    `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      this.productsManager.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      paginationHTML += `
        <button class="pagination-page w-8 h-8 rounded-full glass-dark flex items-center justify-center hover:bg-primary hover:text-white transition" data-page="1">
          1
        </button>
      `;
      if (startPage > 2) {
        paginationHTML += `
          <button class="w-8 h-8 rounded-full glass-dark flex items-center justify-center">
            <i class="fas fa-ellipsis-h text-xs"></i>
          </button>
        `;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-page w-8 h-8 rounded-full ${
          this.productsManager.currentPage === i
            ? "bg-primary text-white"
            : "glass-dark hover:bg-primary hover:text-white"
        } transition flex items-center justify-center" data-page="${i}">
          ${i}
        </button>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `
          <button class="w-8 h-8 rounded-full glass-dark flex items-center justify-center">
            <i class="fas fa-ellipsis-h text-xs"></i>
          </button>
        `;
      }
      paginationHTML += `
        <button class="pagination-page w-8 h-8 rounded-full glass-dark flex items-center justify-center hover:bg-primary hover:text-white transition" data-page="${totalPages}">
          ${totalPages}
        </button>
      `;
    }

    // Next button
    paginationHTML += `
      <button class="pagination-next w-8 h-8 rounded-full glass-dark flex items-center justify-center ${
        this.productsManager.currentPage === totalPages
          ? "opacity-50 cursor-not-allowed"
          : ""
      }" ${this.productsManager.currentPage === totalPages ? "disabled" : ""}>
        <i class="fas fa-chevron-right text-xs"></i>
      </button>
    `;

    document.getElementById("pagination").innerHTML = paginationHTML;

    // Add event listeners to pagination buttons
    document.querySelectorAll(".pagination-page").forEach((button) => {
      button.addEventListener("click", (e) => {
        this.productsManager.currentPage = parseInt(
          e.target.getAttribute("data-page")
        );
        this.renderProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });

    document.querySelector(".pagination-prev").addEventListener("click", () => {
      if (this.productsManager.currentPage > 1) {
        this.productsManager.currentPage--;
        this.renderProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    document.querySelector(".pagination-next").addEventListener("click", () => {
      const totalPages = Math.ceil(
        this.productsManager.getFilteredProducts().length /
          this.productsManager.productsPerPage
      );
      if (this.productsManager.currentPage < totalPages) {
        this.productsManager.currentPage++;
        this.renderProducts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
