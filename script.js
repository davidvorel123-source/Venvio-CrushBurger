// Interactivity for Bistro Demo

document.addEventListener('DOMContentLoaded', () => {
    
    // Mobile menu toggle demo
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if(menuBtn) {
        menuBtn.addEventListener('click', () => {
            alert('Zde by se otevřelo mobilní menu.');
        });
    }

    // Main call to action
    const mainCtas = document.querySelectorAll('a[href="#order"]');
    mainCtas.forEach(cta => {
        cta.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Přesměrování na formulář pro rozvoz... (Demo)');
        });
    });

    // --- Shopping Cart Logic ---
    let cart = JSON.parse(localStorage.getItem('crushCart')) || [];
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Toggle Sidebar
    if (cartBtn && cartSidebar && closeCartBtn) {
        cartBtn.addEventListener('click', () => cartSidebar.classList.add('open'));
        closeCartBtn.addEventListener('click', () => cartSidebar.classList.remove('open'));
    }

    // Add to cart functionality
    const orderButtons = document.querySelectorAll('.card-content button');
    
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.menu-card');
            let burgerName = card.querySelector('h3').innerText;
            const priceText = card.querySelector('.price-tag').innerText;
            let price = parseInt(priceText.replace(/\D/g, ''));
            
            // Check for extras
            const cheeseCheckbox = card.querySelector('.extra-cheese');
            const baconCheckbox = card.querySelector('.extra-bacon');
            let extras = [];
            
            if (cheeseCheckbox && cheeseCheckbox.checked) {
                price += parseInt(cheeseCheckbox.value);
                extras.push('+ Sýr');
            }
            if (baconCheckbox && baconCheckbox.checked) {
                price += parseInt(baconCheckbox.value);
                extras.push('+ Slanina');
            }
            
            if (extras.length > 0) {
                burgerName += ` (${extras.join(', ')})`;
            }

            // Add to array
            cart.push({ name: burgerName, price: price });
            updateCart();

            // Cool vibration effect on button
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
                
                // Show notification briefly or just update button
                const originalText = btn.innerText;
                btn.innerText = 'PŘIDÁNO ✔';
                btn.style.backgroundColor = 'var(--color-black)';
                btn.style.color = 'var(--color-white)';
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    if(card.classList.contains('highlight-card')){
                        btn.style.backgroundColor = 'var(--color-black)';
                    } else {
                        btn.style.backgroundColor = 'var(--color-brand)';
                    }
                }, 1000);
                
            }, 100);
            
            // Open sidebar to show user it was added
            if (cartSidebar) {
                cartSidebar.classList.add('open');
            }
        });
    });

    function updateCart() {
        if (!cartItemsContainer || !cartCount || !cartTotalPrice) return;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Košík je zatím prázdný. Běž si pro burger!</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span class="cart-item-price">${item.price} Kč</span>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">X</button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        cartCount.innerText = cart.length;
        cartTotalPrice.innerText = `${total} Kč`;
        
        // Save to localStorage
        localStorage.setItem('crushCart', JSON.stringify(cart));

        // Add remove listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }
    
    // Initial render
    updateCart();
});
