export class BookList extends HTMLElement {
    constructor() {
        super();
        this.books = [
            { title: 'JavaScript Mastery', author: 'John Doe', price: 29.99, image: './img/Book.png' },
            { title: 'Web Components Deep Dive', author: 'Jane Smith', price: 34.99, image: './img/Book.png' }
        ];
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="book-grid">
                ${this.books.map(book => `
                    <book-item
                        title="${book.title}"
                        author="${book.author}"
                        price="${book.price}"
                        image="${book.image}"
                    ></book-item>
                `).join('')}
            </div>
        `;
    }
}

// Define the custom element
customElements.define('book-list', BookList);