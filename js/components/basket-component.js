// components/basket-component.js
export class BasketComponent extends HTMLElement {
    constructor() {
        super();
        this.items = JSON.parse(localStorage.getItem('basket')) || [];
        this.total = 0;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.calculateTotal();
    }

    setupEventListeners() {
        document.addEventListener('add-to-basket', (event) => {
            this.addToBasket(event.detail);
        });
    }

    addToBasket(book) {
        this.items.push(book);
        localStorage.setItem('basket', JSON.stringify(this.items));
        this.calculateTotal();
        this.render();
    }

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.price, 0);
        this.dispatchEvent(new CustomEvent('basket-updated', {
            detail: { total: this.total, count: this.items.length }
        }));
    }

    render() {
        this.innerHTML = `
            <nav class="header-icons">
                <a href="basket.html" class="basket-link">
                    <img src="./svg/basket.svg" alt="Basket" />
                    <span class="item-count">${this.items.length}</span>
                </a>
            </nav>
        `;
    }
    
}
// this.innerHTML = `
// <nav class="header-icons">
// <a href="basket.html"><img src="./svg/basket.svg" />
// Basket: ${this.items.length} items
// Total: $${this.total.toFixed(2)}</a>
// </nav>
// `;

// Define the custom element
customElements.define('basket-component', BasketComponent);