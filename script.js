let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
let selectedQuantity = {};  // Voor het bijhouden van de geselecteerde hoeveelheid per product

document.addEventListener("DOMContentLoaded", function() {
    // Laad producten op de productpagina
    if (document.getElementById("product-list")) {
        fetch('producten.json')
            .then(response => response.json())
            .then(data => {
                let productList = document.getElementById("product-list");
                data.forEach(product => {
                    selectedQuantity[product.naam] = 0;  // Stel de geselecteerde hoeveelheid voor elk product in
                    let productDiv = document.createElement("div");
                    productDiv.classList.add("product");
                    productDiv.innerHTML = `
                        <img src="${product.afbeelding}" alt="${product.naam}">
                        <h2>${product.naam}</h2>
                        <p>${product.beschrijving}</p>
                        <p><strong>Prijs: €${product.prijs}</strong></p>
                        <button onclick="decreaseSelectedQuantity('${product.naam}')">-</button>
                        <span>${selectedQuantity[product.naam]}</span>
                        <button onclick="increaseSelectedQuantity('${product.naam}')">+</button>
                        <button onclick="addToCart('${product.naam}', ${product.prijs})">Voeg toe aan winkelwagentje</button>
                    `;
                    productList.appendChild(productDiv);
                });
            })
            .catch(error => console.error('Fout bij het laden van producten:', error));
    }

    // Laad winkelwagentje-items op de winkelwagentje-pagina
    if (document.getElementById("cart-items")) {
        updateCartDisplay();
    }
});

function increaseSelectedQuantity(productName) {
    selectedQuantity[productName]++;
    updateSelectedQuantityDisplay(productName);
}

function decreaseSelectedQuantity(productName) {
    if (selectedQuantity[productName] > 0) {
        selectedQuantity[productName]--;
        updateSelectedQuantityDisplay(productName);
    }
}

function updateSelectedQuantityDisplay(productName) {
    const productDiv = document.querySelector(`div:has(h2:contains('${productName}'))`);
    const quantityDisplay = productDiv.querySelector('span');
    quantityDisplay.textContent = selectedQuantity[productName];
}

function addToCart(productName, productPrice) {
    const quantity = selectedQuantity[productName];
    if (quantity > 0) {
        const existingProduct = cart.find(item => item.name === productName);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: quantity });
        }
        totalPrice += productPrice * quantity;
        updateCartDisplay();
        localStorage.setItem('cart', JSON.stringify(cart)); // Bewaar winkelwagentje in localStorage
        selectedQuantity[productName] = 0;  // Reset de geselecteerde hoeveelheid na toevoeging
    }
}

// De andere functies blijven zoals ze zijn...
