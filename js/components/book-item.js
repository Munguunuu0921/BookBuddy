export class BookItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['name', 'author', 'price', 'image', 'bookId', 'pubDate', 'userImage'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    getFormattedDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    render() {
        const formattedDate = this.getFormattedDate(this.getAttribute('pubDate'));
        const userImage = this.getAttribute('userImage') || './img/1.jpg';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    flex: 0 0 auto;
                    width: 200px;
                    height: 340px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background: #fff;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
                    overflow: hidden;
                }
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                }
                .book-item {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    text-align: center;
                }
                .book-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }
                .book-details {
                    padding: 10px;
                    flex-grow: 1;
                    background-color: var(--color-main);
                }
                .book-name {
                    font-size: 1rem;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .book-meta {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 10px;
                }
                .book-price {
                    font-size: 1rem;
                    font-weight: bold;
                    color: var(--color-gray);
                    margin-bottom: 10px;
                }
               .user-circle img {
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                }
                .book-actions {
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                }
                .book-actions img {
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                }
            </style>
            <div class="book-item">
                <img src="${this.getAttribute('image')}" alt="Book Cover" class="book-image">
                <div class="book-details">
                    <h3 class="book-name">${this.getAttribute('name')}</h3>
                    <p class="book-meta">${this.getAttribute('author')}</p>
                    <p class="book-meta">${formattedDate}</p>
                    <p class="book-price">$${this.getAttribute('price')}</p>
                    <div class="book-actions">
                       <a class="user-circle" href="#">
                            <img src="${userImage}" alt="User">
                        </a>
                        <img src="./svg/chat.svg" alt="Chat Icon">
                        <img src="./svg/eye.svg" alt="View Icon">
                        <img src="./svg/basket.svg" alt="Add to Basket Icon" class="basket-btn">
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const basketButton = this.shadowRoot.querySelector('.basket-btn');
        basketButton.addEventListener('click', () => {
            const bookData = {
                bookId: this.getAttribute('bookId'),
                name: this.getAttribute('name'),
                pubDate: this.getAttribute('pubDate'),
                price: parseFloat(this.getAttribute('price')),
                userImage: this.getAttribute('userImage'),
            };

            // LocalStorage-д нэмэх
            const basket = JSON.parse(localStorage.getItem('basket')) || [];
            basket.push(bookData);
            localStorage.setItem('basket', JSON.stringify(basket));

            document.dispatchEvent(new CustomEvent('add-to-basket', {
                detail: bookData,
                bubbles: true,
                composed: true
            }));
        });
    }
}

customElements.define('book-item', BookItem);
