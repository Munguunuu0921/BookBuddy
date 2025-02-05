export class BasketComponent extends HTMLElement {
    constructor() {
        super();
        this.items = JSON.parse(localStorage.getItem('basket')) || [];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.addEventListener('add-to-basket', () => {
            this.updateBasket();
        });
    }

    updateBasket() {
        this.items = JSON.parse(localStorage.getItem('basket')) || [];
        this.render();
    }

    render() {
        this.innerHTML = `
            <a href="basket.html" class="basket-link">
                <img src="./svg/basket.svg" alt="Basket" />
                <span class="item-count">${this.items.length}</span>
            </a>
        `;
    }
}

customElements.define('basket-component', BasketComponent);
