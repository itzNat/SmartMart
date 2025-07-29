export class UIManager {
  static showConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    // Clear previous confetti
    confettiContainer.innerHTML = '';
    
    // Create confetti particles
    const colors = ['#6366f1', '#818cf8', '#f43f5e', '#fb7185', '#a5b4fc', '#fda4af'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = '-10px';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      
      confettiContainer.appendChild(confetti);
      
      // Animate confetti
      const animationDuration = Math.random() * 3 + 2;
      confetti.style.animation = `fall ${animationDuration}s linear forwards`;
      
      // Create keyframes for falling animation
      const keyframes = `
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            opacity: 1;
          }
        }
      `;
      
      // Add keyframes to style
      const style = document.createElement('style');
      style.innerHTML = keyframes;
      document.head.appendChild(style);
      
      // Remove confetti after animation
      setTimeout(() => {
        confetti.remove();
        style.remove();
      }, animationDuration * 1000);
    }
  }

  static cartIconBounce() {
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.classList.add('bounce');
    setTimeout(() => {
      cartBtn.classList.remove('bounce');
    }, 500);
  }

  static renderSortBy() {
    // Define our options in an object
    const sortOptions = {
      'featured': 'Featured',
      'price-low': 'Price: Low to High',
      'price-high': 'Price: High to Low',
      'rating': 'Customer Rating',
      'newest': 'Newest Arrivals'
    };

    const customSelect = document.querySelector('.custom-category-select');
    const selectedText = customSelect.querySelector('.selected-text');
    const optionsContainer = customSelect.querySelector('.options');
    const hiddenSelect = document.getElementById('sort-by');
    
    // Populate both the hidden select and custom dropdown
    Object.entries(sortOptions).forEach(([value, text]) => {
      // Add to hidden select
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      hiddenSelect.appendChild(option);
      
      // Add to custom dropdown
      const optionElement = document.createElement('div');
      optionElement.className = 'option px-4 py-2 text-sm text-dark-800 hover:bg-indigo-50 cursor-pointer transition-colors';
      optionElement.dataset.value = value;
      
      optionElement.innerHTML = `
        <div class="flex items-center">
          <span>${text}</span>
          <svg class="ml-auto w-4 h-4 text-primary hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      `;
      
      optionsContainer.appendChild(optionElement);
    });

    // Toggle dropdown
    customSelect.querySelector('.selected-option').addEventListener('click', function() {
      customSelect.classList.toggle('active');
    });
    
    // Select option
    optionsContainer.addEventListener('click', function(e) {
      const option = e.target.closest('.option');
      if (!option) return;
      
      const value = option.dataset.value;
      const text = option.querySelector('span').textContent;
      
      // Update UI
      selectedText.textContent = text;
      customSelect.querySelectorAll('.option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Update hidden select
      hiddenSelect.value = value;
      hiddenSelect.dispatchEvent(new Event('change'));
      
      // Close dropdown
      customSelect.classList.remove('active');
    });
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('active');
      }
    });
    
    // Initialize selected option
    const initialValue = hiddenSelect.value;
    document.querySelector(`.option[data-value="${initialValue}"]`).classList.add('active');
  }
}