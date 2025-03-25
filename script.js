let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

document.addEventListener("DOMContentLoaded", function() {
    // Load products on the product page
    if (document.getElementById("product-list")) {
        fetch('producten.json')
            .then(response => response.json())
            .then(data => {
                let productList = document.getElementById("product-list");
                data.forEach(product => {
                    let productDiv = document.createElement("div");
                    productDiv.classList.add("product");
                    productDiv.innerHTML = `
                        <img src="${product.afbeelding}" alt="${product.naam}">
                        <h2>${product.naam}</h2>
                        <p>${product.beschrijving}</p>
                        <p><strong>Prijs: €${product.prijs}</strong></p>
                        <button onclick="addToCart('${product.naam}', ${product.prijs})">Voeg toe aan winkelwagentje</button>
                    `;
                    productList.appendChild(productDiv);
                });
            })
            .catch(error => console.error('Error loading products:', error));
    }

    // Load cart items on the cart page
    if (document.getElementById("cart-items")) {
        updateCartDisplay();
    }
});

function addToCart(productName, productPrice) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    totalPrice += productPrice;
    updateCartDisplay();
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart to localStorage
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.name} - €${item.price.toFixed(2)} x ${item.quantity} 
                <button onclick="increaseQuantity('${item.name}')">+</button>
                <button onclick="decreaseQuantity('${item.name}')">-</button>
                <button onclick="removeFromCart('${item.name}')">Verwijder</button>`;
            cartItems.appendChild(li);
        });
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}

function increaseQuantity(productName) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity++;
        totalPrice += product.price;
        updateCartDisplay();
    }
}

function decreaseQuantity(productName) {
    const product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity--;
        totalPrice -= product.price;
        if (product.quantity <= 0) {
            removeFromCart(productName);
        } else {
            updateCartDisplay();
        }
    }
}

function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartDisplay();
}
