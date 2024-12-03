// components/book-item.js
export class BookItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'author', 'price', 'image'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid #ddd;
                    margin: 10px;
                    padding: 10px;
                }
                img { max-width: 200px; }
                button {
                    background-color: var(--primary-color);
                    color: white;
                }
                :host(:hover) {
                    background-color: rgba(0,0,0,0.1);
                }
            </style>
            <div>
                <img src="${this.getAttribute('image') || './img/Book.png'}" alt="Book Cover">
                <h3>${this.getAttribute('title') || 'Unknown Title'}</h3>
                <p>Author: ${this.getAttribute('author') || 'Unknown Author'}</p>
                <p>Price: $${this.getAttribute('price') || '0'}</p>
                <button class="add-to-basket">Add to Basket</button>
            </div>
        `;
    }

    setupEventListeners() {
        const addButton = this.shadowRoot.querySelector('.add-to-basket');
        addButton.addEventListener('click', () => {
            const bookData = {
                title: this.getAttribute('title'),
                price: parseFloat(this.getAttribute('price'))
            };
            this.dispatchEvent(new CustomEvent('add-to-basket', {
                detail: bookData,
                bubbles: true,
                composed: true
            }));
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
        }
    }
}

// Define the custom element
customElements.define('book-item', BookItem);