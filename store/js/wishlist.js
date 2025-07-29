export class WishlistManager {
  constructor() {
    this.wishlist = [];
  }

  toggleWishlist(productId, productsData) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const existingIndex = this.wishlist.findIndex(item => item.id === productId);

    if (existingIndex >= 0) {
      // Remove from wishlist
      this.wishlist.splice(existingIndex, 1);
    } else {
      // Add to wishlist
      this.wishlist.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.thumbnail
      });
    }
    this.updateWishlist();
    
    // Show animation on wishlist button
    document.getElementById('wishlist-btn').classList.add('shake');
    setTimeout(() => {
      document.getElementById('wishlist-btn').classList.remove('shake');
    }, 500);
    
    return this.wishlist;
  }

  updateWishlist() {
    // Update wishlist count
    document.getElementById('wishlist-count').textContent = this.wishlist.length;
    
    // Update wishlist items
    const fullWishlist = document.getElementById('full-wishlist');
    fullWishlist.innerHTML = '';
    
    if (this.wishlist.length === 0) {
      document.getElementById('empty-wishlist').classList.remove('hidden');
      fullWishlist.classList.add('hidden');
      document.getElementById('wishlist-summary').classList.add('hidden');
    } else {
      document.getElementById('empty-wishlist').classList.add('hidden');
      fullWishlist.classList.remove('hidden');
      document.getElementById('wishlist-summary').classList.remove('hidden');
      
      this.wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'flex items-center py-4 border-b border-gray-200';

        wishlistItem.innerHTML = `
          <div class="w-16 h-16 rounded-lg overflow-hidden mr-4">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-contain">
          </div>
          <div class="flex-1">
            <h3 class="font-medium">${item.title}</h3>
            <p class="text-sm text-gray-500">$${item.price.toFixed(2)}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button class="wishlist-remove w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition" data-id="${item.id}">
              <i class="fas fa-times text-xs"></i>
            </button>
            <button class="wishlist-add-to-cart px-3 py-1 rounded-full text-xs glass-dark hover:bg-primary hover:text-white transition" 
              data-id="${item.id}" 
              data-name="${item.title}" 
              data-price="${item.price}" 
              data-image="${item.image}">
              Add to Cart
            </button>
          </div>
        `;
        
        fullWishlist.appendChild(wishlistItem);
      });
    }
  }

  setupWishlistEventListeners(cartManager, productsData) {
    document.getElementById('wishlist-btn').addEventListener('click', this.toggleWishlistSidebar);
    document.getElementById('close-wishlist').addEventListener('click', this.closeWishlistSidebar);
    document.getElementById('close-wishlist-continue').addEventListener('click', this.closeWishlistSidebar);
    document.getElementById('wishlist-to-cart').addEventListener('click', () => this.addAllWishlistToCart(cartManager));
    
    document.addEventListener('click', (e) => {
      if (e.target.closest('.wishlist-remove')) {
        const id = e.target.closest('button').getAttribute('data-id');
        this.wishlist = this.wishlist.filter(item => item.id != id);
        this.updateWishlist();
      }
      
      if (e.target.closest('.wishlist-add-to-cart')) {
        const id = e.target.getAttribute('data-id');
        const name = e.target.getAttribute('data-name');
        const price = e.target.getAttribute('data-price');
        const image = e.target.getAttribute('data-image');
        cartManager.addToCart(id, name, price, image);
      }
    });
  }

  addAllWishlistToCart(cartManager) {
    this.wishlist.forEach(item => {
      cartManager.addToCart(item.id, item.title, item.price, item.image);
    });
  }

  toggleWishlistSidebar() {
    document.getElementById('wishlist-sidebar').classList.toggle('open');
    document.body.style.overflow = 
      document.getElementById('wishlist-sidebar').classList.contains('open') ? 'hidden' : '';
    
    // Close cart if open
    if (document.getElementById('cart-sidebar').classList.contains('open')) {
      document.getElementById('cart-sidebar').classList.remove('open');
    }
  }

  closeWishlistSidebar() {
    document.getElementById('wishlist-sidebar').classList.remove('open');
    document.body.style.overflow = '';
  }
}