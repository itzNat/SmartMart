export class CartManager {
  constructor() {
    this.cart = [];
  }

  addToCart(id, title, price, image) {
    
    const retrievedCartLS = localStorage.getItem('myStoredCart')
    const retrievedCart = JSON.parse(retrievedCartLS)

    console.log(retrievedCart)

    retrievedCart != null ? this.cart = [...retrievedCart] : this.cart = []
    console.log(retrievedCart)
    
    // Check if item already exists in cart
      const existingItem = this.cart.find(item => item.id === id);
      
      console.log(retrievedCart, this.cart)
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ id, title, price: parseFloat(price), image, quantity: 1 });
      console.log(this.cart)
    }
    
    console.log(this.cart)
    localStorage.setItem('myStoredCart', JSON.stringify(this.cart))
    
    this.updateCart();
    return this.cart;
  }

  updateCart() {
    // localStorage.clear('myStoredCart')      
    const retrievedCartLS = localStorage.getItem('myStoredCart')
    const retrievedCart = JSON.parse(retrievedCartLS)

    retrievedCart != null ? this.cart = [...retrievedCart] : this.cart = []

    const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
    
    const fullCart = document.getElementById('full-cart');
    fullCart.innerHTML = '';
    
    if (this.cart.length === 0) {
      document.getElementById('empty-cart').classList.remove('hidden');
      fullCart.classList.add('hidden');
      document.getElementById('cart-summary').classList.add('hidden');
    } else {
      document.getElementById('empty-cart').classList.add('hidden');
      fullCart.classList.remove('hidden');
      document.getElementById('cart-summary').classList.remove('hidden');
      
      let subtotal = 0;
      
      this.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center py-4 border-b border-gray-200';
        cartItem.innerHTML = `
          <div class="w-16 h-16 rounded-lg overflow-hidden mr-4">
            <img src="${item.image}" alt="${item.title}" class="w-full h-full object-contain">
          </div>
          <div class="flex-1">
            <h3 class="font-medium">${item.title}</h3>
            <p class="text-sm text-gray-500">$${Number(item.price).toFixed(2)}</p>
          </div>
          <div class="flex items-center">
            <button class="decrease-quantity w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition" data-id="${item.id}">
              <i class="fas fa-minus text-xs"></i>
            </button>
            <span class="mx-2">${item.quantity}</span>
            <button class="increase-quantity w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-100 transition" data-id="${item.id}">
              <i class="fas fa-plus text-xs"></i>
            </button>
          </div>
          <div class="ml-4 text-right">
            <span class="font-medium">$${itemTotal.toFixed(2)}</span>
            <button class="remove-item block text-xs text-gray-500 hover:text-primary mt-1" data-id="${item.id}">
              Remove
            </button>
          </div>
        `;
        
        fullCart.appendChild(cartItem);
      });
      
      // Update totals
      document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById('cart-total').textContent = `$${subtotal.toFixed(2)}`;
    }
  }

  setupCartEventListeners() {
    document.getElementById('cart-btn').addEventListener('click', this.toggleCartSidebar);
    document.getElementById('close-cart').addEventListener('click', this.closeCartSidebar);
    document.getElementById('close-cart-continue').addEventListener('click', this.closeCartSidebar);
    
    // These would be added when cart items are rendered
    document.addEventListener('click', (e) => {
      
      const retrievedCartLS = localStorage.getItem('myStoredCart')
      const retrievedCart = JSON.parse(retrievedCartLS)
      this.cart = [...retrievedCart]
      console.log(this.cart)
      if (e.target.closest('.increase-quantity')) {
        

        console.log('love')
        const id = e.target.closest('button').getAttribute('data-id');
        const item = this.cart.find(item => item.id === id);
        if (item) {
          item.quantity += 1;
          
        }
      }
      
      if (e.target.closest('.decrease-quantity')) {
        console.log('love')
        const id = e.target.closest('button').getAttribute('data-id');
        console.log(typeof(id))
        const item = this.cart.find(item => item.id === id);
        if (item) {
          if (item.quantity > 1) {
            item.quantity -= 1;
          } else {
            this.cart = this.cart.filter(item => item.id !== id);
          }
        }
      }
      
      if (e.target.closest('.remove-item')) {
        const id = e.target.getAttribute('data-id');
        this.cart = this.cart.filter(item => item.id !== id);
      }

      localStorage.setItem('myStoredCart', JSON.stringify(this.cart))
      this.updateCart();

    });
  }

  toggleCartSidebar() {
    document.getElementById('cart-sidebar').classList.toggle('open');
    document.body.style.overflow = 
      document.getElementById('cart-sidebar').classList.contains('open') ? 'hidden' : '';
    
    // Close wishlist if open
    if (document.getElementById('wishlist-sidebar').classList.contains('open')) {
      document.getElementById('wishlist-sidebar').classList.remove('open');
    }
  }

  closeCartSidebar() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.body.style.overflow = '';
  }
}