import { formatCategory, getTagName, getCategoryName } from "./constants.js";

export class ProductsManager {
  constructor() {
    this.productsData = [];
    this.currentPage = 1;
    this.productsPerPage = 12;
    this.currentView = "grid";
    this.currentCategory = "all";
    this.currentTag = "all";
    this.currentSort = "featured";
    this.currentSearch = "";
  }

  async fetchData() {
    try {
      this.productsData = await fetch(`https://dummyjson.com/products?limit=0`)
        .then((res) => res.json())
        .then((data) => [...data.products]);
      return this.productsData;
    } catch (error) {
      console.log("Could not get data", error);
    }
  }

  getFilteredProducts() {
    let filtered = [...this.productsData];

    // Apply category filter
    if (this.currentCategory !== "all") {
      filtered = filtered.filter(
        (product) => formatCategory(product.category) === this.currentCategory
      );
    }

    // Apply tag filter
    if (this.currentTag !== "all") {
      filtered = filtered.filter(
        (product) => product.tags && product.tags.includes(this.currentTag)
      );
    }

    // Apply search filter
    if (this.currentSearch) {
      filtered = filtered.filter((product) => {
        product.title.toLowerCase().includes(this.currentSearch) ||
          product.description.toLowerCase().includes(this.currentSearch);
      });
    }

    // Apply sorting
    switch (this.currentSort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.meta.updatedAt) - new Date(a.meta.updatedAt)
        );
        break;
      default: // 'featured' - no sorting or some custom logic
        break;
    }

    return filtered;
  }

  createProductElement(product, isInWishlist) {
    const wishlistClass = isInWishlist ? "text-primary" : "text-gray-700";

    const tagsDisplay =
      product.tags && product.tags.length > 0
        ? `<div class="flex flex-wrap gap-1 mt-2">
          ${product.tags
            .slice(0, 3)
            .map(
              (tag) =>
                `<span class="text-xs px-2 py-1 rounded-full bg-gray-100">${getTagName(
                  tag
                )}</span>`
            )
            .join("")}
         </div>`
        : "";

    return `
      <div class="product-card glass rounded-xl overflow-hidden relative group" data-id="${
        product.id
      }">
        <div class="relative overflow-hidden p-3 ${
          this.currentView === "list" ? "h-full" : "h-48"
        }">
          <a href="product.html?id=${product.id}">
            <img src="${product.thumbnail}" alt="${
      product.title
    }" class="w-full h-full object-contain transition duration-500 group-hover:scale-105">
          </a>
          <div class="absolute top-3 right-3 flex flex-col space-y-2 md:opacity-0 group-hover:opacity-100 transition ${
            this.currentView === "list" ? "gap-2" : "gap-0"
          }">
            <button class="wishlist-btn w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white ${wishlistClass} transition" data-id="${
      product.id
    }">
              <i class="fas fa-heart text-xs"></i>
            </button>
            <a href="product.html?id=${product.id}">
              <button class="quick-view-btn w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-primary hover:text-white transition" data-product="${
                product.id
              }">
                <i class="fas fa-eye text-xs"></i>
              </button>
            </a>
          </div>
        </div>
        <div class="p-4 ${
          this.currentView === "list"
            ? "flex-1 flex flex-col justify-center"
            : ""
        }">
          <div class="flex justify-between items-start">
            <div>
              <a href="product.html?id=${product.id}">
                <h3 class="font-medium text-gray-800">${product.title}</h3>
              </a>
              <p class="text-xs text-gray-500">${
                product.brand ?? "others"
              } • ${getCategoryName(formatCategory(product.category))}</p>
            </div>
            <div class="flex items-center">
              <i class="fas fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs ml-1">${product.rating}</span>
            </div>
          </div>
          <div class="mt-3 flex justify-between items-center">
            <span class="font-bold text-primary">$${product.price.toFixed(
              2
            )}</span>
            <button class="add-to-cart px-3 py-1 rounded-full text-xs glass-dark hover:bg-primary hover:text-white transition" 
              data-id="${product.id}" 
              data-name="${product.title}" 
              data-price="${product.price}" 
              data-image="${product.thumbnail}">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
