export class CheckoutManager {
  constructor(cartManager) {
    this.cartManager = cartManager;
  }

  init() {
    // Open checkout modal
    document.getElementById('checkout-btn').addEventListener('click', () => {
      if (this.cartManager.cart.length === 0) {
        alert('Your cart is empty. Please add items before checkout.');
        return;
      }
      
      // Update checkout totals
      const subtotal = this.cartManager.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
      document.getElementById('checkout-total').textContent = `$${subtotal.toFixed(2)}`;
      
      // Reset form
      document.getElementById('checkout-form').classList.remove('hidden');
      document.getElementById('checkout-success').classList.add('hidden');
      document.getElementById('credit-card-fields').classList.add('hidden');
      
      // Show modal
      document.getElementById('checkout-modal').classList.add('open');
      document.body.style.overflow = 'hidden';
    });
    
    // Close checkout modal
    document.getElementById('close-checkout-modal').addEventListener('click', () => {
      document.getElementById('checkout-modal').classList.remove('open');
      document.body.style.overflow = '';
    });
    
    // Payment method selection
    document.querySelectorAll('.payment-method').forEach(method => {
      method.addEventListener('click', () => {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('bg-primary', 'text-white'));
        method.classList.add('bg-primary', 'text-white');
        
        if (method.dataset.method === 'credit') {
          document.getElementById('credit-card-fields').classList.remove('hidden');
        } else {
          document.getElementById('credit-card-fields').classList.add('hidden');
        }
      });
    });
    
    // Place order
    document.getElementById('place-order-btn').addEventListener('click', (e) => {
      e.preventDefault();
      
      // Simple validation
      const email = document.getElementById('checkout-email').value;
      const address = document.getElementById('checkout-address').value;
      const selectedPayment = document.querySelector('.payment-method.bg-primary');
      
      if (!email || !address || !selectedPayment) {
        alert('Please fill all required fields and select a payment method');
        return;
      }
      
      if (selectedPayment.dataset.method === 'credit') {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCvv = document.getElementById('card-cvv').value;
        const cardName = document.getElementById('card-name').value;
        
        if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
          alert('Please fill all credit card details');
          return;
        }
      }
      
      // Simulate processing
      const placeOrderBtn = document.getElementById('place-order-btn');
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
      
      // Simulate API call
      setTimeout(() => {
        // Show success
        document.getElementById('checkout-form').classList.add('hidden');
        document.getElementById('checkout-success').classList.remove('hidden');
        
        // Clear cart
        this.cartManager.cart = [];
        this.cartManager.updateCart();
        document.getElementById('cart-sidebar').classList.remove('open');
        
        // Reset button
        placeOrderBtn.disabled = false;
        placeOrderBtn.textContent = 'Place Order';
      }, 2000);
    });
    
    // Continue shopping after checkout
    document.getElementById('continue-shopping-btn').addEventListener('click', () => {
      document.getElementById('checkout-modal').classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}