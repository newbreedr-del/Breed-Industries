document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const servicesPool = document.getElementById('services-pool');
  const cartDropzone = document.getElementById('cart-dropzone');
  const checkoutBtn = document.getElementById('checkout-btn');
  const totalAmount = document.querySelector('.total-amount');
  const subtotalAmount = document.getElementById('subtotal-amount');
  const discountAmount = document.getElementById('discount-amount');
  
  // State
  let cartItems = [];
  
  // Initialize drag and drop
  function initDragAndDrop() {
    const draggables = document.querySelectorAll('.service-item');
    
    // Make service items draggable
    draggables.forEach(item => {
      item.addEventListener('dragstart', handleDragStart);
      item.addEventListener('click', handleServiceClick);
    });
    
    // Set up drop zones
    cartDropzone.addEventListener('dragover', handleDragOver);
    cartDropzone.addEventListener('dragleave', handleDragLeave);
    cartDropzone.addEventListener('drop', handleDrop);
    
    // Click to add/remove
    cartDropzone.addEventListener('click', handleCartClick);
  }
  
  // Event Handlers
  function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.service);
    e.target.classList.add('dragging');
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    cartDropzone.classList.add('highlight');
  }
  
  function handleDragLeave() {
    cartDropzone.classList.remove('highlight');
  }
  
  function handleDrop(e) {
    e.preventDefault();
    cartDropzone.classList.remove('highlight');
    
    const serviceName = e.dataTransfer.getData('text/plain');
    const serviceItem = document.querySelector(`[data-service="${serviceName}"]`);
    
    if (serviceItem) {
      addToCart(serviceItem);
    }
  }
  
  function handleServiceClick(e) {
    const serviceItem = e.target.closest('.service-item');
    if (serviceItem) {
      addToCart(serviceItem);
    }
  }
  
  function handleCartClick(e) {
    const removeBtn = e.target.closest('.remove-item');
    if (removeBtn) {
      const cartItem = removeBtn.closest('.cart-item');
      const serviceName = cartItem.dataset.service;
      removeFromCart(serviceName);
    }
  }
  
  // Cart Operations
  function addToCart(serviceItem) {
    const serviceName = serviceItem.dataset.service;
    const servicePrice = parseInt(serviceItem.dataset.price);
    
    // Check if already in cart
    if (cartItems.some(item => item.name === serviceName)) {
      return;
    }
    
    // Add to cart items array
    cartItems.push({
      name: serviceName,
      price: servicePrice
    });
    
    // Update UI
    updateCartUI();
  }
  
  function removeFromCart(serviceName) {
    cartItems = cartItems.filter(item => item.name !== serviceName);
    updateCartUI();
  }
  
  function updateCartUI() {
    // Clear cart UI
    cartDropzone.innerHTML = '';
    
    if (cartItems.length === 0) {
      // Show empty state
      cartDropzone.innerHTML = `
        <div class="empty-state text-center py-12 px-4">
          <div class="w-16 h-16 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-arrow-left text-2xl text-navy/40"></i>
          </div>
          <h4 class="font-medium text-gray-500 mb-1">Your package is empty</h4>
          <p class="text-sm text-gray-400">Drag services here or click to browse</p>
        </div>
      `;
    } else {
      // Add cart items
      cartItems.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.service = item.name;
        cartItem.draggable = true;
        cartItem.innerHTML = `
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center text-navy mr-3">
              <i class="fas fa-grip-vertical text-navy/40"></i>
            </div>
            <span>${item.name}</span>
          </div>
          <div class="flex items-center">
            <span class="text-gold font-semibold mr-4">R${item.price.toLocaleString()}</span>
            <button class="remove-item text-red-500 hover:text-red-600 transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `;
        
        // Add drag and drop for reordering
        cartItem.addEventListener('dragstart', handleCartItemDragStart);
        cartDropzone.appendChild(cartItem);
      });
    }
    
    // Update totals
    updateTotals();
  }
  
  function handleCartItemDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.service);
    e.target.classList.add('dragging');
  }
  
  function updateTotals() {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
    const discount = Math.floor(subtotal * 0.1); // 10% discount for multiple services
    const total = subtotal - (cartItems.length > 1 ? discount : 0);
    
    subtotalAmount.textContent = subtotal.toLocaleString();
    discountAmount.textContent = cartItems.length > 1 ? discount.toLocaleString() : '0';
    totalAmount.textContent = total.toLocaleString();
  }
  
  // Initialize
  initDragAndDrop();
  
  // Handle checkout
  checkoutBtn.addEventListener('click', function() {
    if (cartItems.length === 0) {
      alert('Please add services to your package before checking out.');
      return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    const discount = Math.floor(total * 0.1);
    const finalTotal = total - (cartItems.length > 1 ? discount : 0);
    
    // Build WhatsApp message
    const servicesList = cartItems.map(item => `• ${item.name} (R${item.price.toLocaleString()})`).join('\n');
    const message = `Hi Breed Industries! I'd like a quote for the following services:\n\n${servicesList}\n\nSubtotal: R${total.toLocaleString()}\n`;
    
    if (cartItems.length > 1) {
      message += `Discount (10%): -R${discount.toLocaleString()}\n`;
    }
    
    message += `Total: R${finalTotal.toLocaleString()}`;
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/27685037221?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  });
});
