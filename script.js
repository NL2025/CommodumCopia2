document.addEventListener('DOMContentLoaded', () => {
    const productenGrid = document.getElementById('producten-grid');
    const winkelwagenItems = document.getElementById('winkelwagen-items');
    const totaalPrijsElement = document.getElementById('totaal-prijs');
    let winkelwagen = [];

    // Producten laden
    async function laadProducten() {
        try {
            const response = await fetch('producten.json');
            const data = await response.json();
            toonProducten(data.producten);
        } catch (error) {
            console.error('Fout bij laden producten:', error);
        }
    }

    // Producten weergeven
    function toonProducten(producten) {
        if (productenGrid) {
            productenGrid.innerHTML = producten.map(product => `
                <div class="product-kaart">
                    <h3>${product.naam}</h3>
                    <p>${product.beschrijving}</p>
                    <p>€${product.prijs.toFixed(2)}</p>
                    <button onclick="voegToeAanWinkelwagen(${product.id}, '${product.naam}', ${product.prijs})">
                        Toevoegen
                    </button>
                </div>
            `).join('');
        }
    }

    // Aan winkelwagen toevoegen
    window.voegToeAanWinkelwagen = (id, naam, prijs) => {
        const bestaandProduct = winkelwagen.find(item => item.id === id);
        
        if (bestaandProduct) {
            bestaandProduct.aantal += 1;
        } else {
            winkelwagen.push({ id, naam, prijs, aantal: 1 });
        }

        updateWinkelwagen();
    };

    // Winkelwagen updaten
    function updateWinkelwagen() {
        if (winkelwagenItems) {
            winkelwagenItems.innerHTML = winkelwagen.map(item => `
                <div class="winkelwagen-item">
                    <span>${item.naam}</span>
                    <span>€${item.prijs.toFixed(2)}</span>
                    <span>Aantal: ${item.aantal}</span>
                    <button onclick="verwijderUitWinkelwagen(${item.id})">Verwijderen</button>
                </div>
            `).join('');

            const totaalPrijs = winkelwagen.reduce((totaal, item) => totaal + (item.prijs * item.aantal), 0);
            
            if (totaalPrijsElement) {
                totaalPrijsElement.textContent = totaalPrijs.toFixed(2);
            }
        }
    }

    // Uit winkelwagen verwijderen
    window.verwijderUitWinkelwagen = (id) => {
        winkelwagen = winkelwagen.filter(item => item.id !== id);
        updateWinkelwagen();
    };

    // Pagina-specifieke initialisatie
    if (productenGrid) {
        laadProducten();
    }
});
