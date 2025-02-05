import { BookList } from './book-list.js';

export class BookModule extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.books = [];
        this.filteredBooks = [];
    }

    async connectedCallback() {
        await this.fetchBooks();
        this.loadState();
        this.render();
        this.setupEventListeners();
    }

    async fetchBooks() {
        try {
            const response = await fetch('http://localhost:3000/api/books'); // API тохируулна
            if (!response.ok) throw new Error('Failed to fetch books');
            this.books = await response.json();
            this.saveToLocalStorage('books', this.books);
        } catch (error) {
            console.error('Error fetching books:', error);
            this.books = this.getFromLocalStorage('books') || []; // Fallback өгөгдөл
        }
        this.filteredBooks = [...this.books];
    }

    setupEventListeners() {
        const searchInput = document.querySelector('.search-container input');
        searchInput.addEventListener('input', (event) => {
            const searchTerm = event.target.value.toLowerCase();
            this.saveToLocalStorage('searchTerm', searchTerm);
            this.filterBooks(searchTerm);
        });

        const filterSelect = document.querySelector('#categorySelect');
        filterSelect.addEventListener('change', (event) => {
            const filterType = event.target.value;
            this.saveToLocalStorage('filterType', filterType);
            this.applyFilter(filterType);
        });
    }

    filterBooks(searchTerm) {
        this.filteredBooks = this.books.filter(book =>
            book.name.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
        this.saveToLocalStorage('filteredBooks', this.filteredBooks); // Хайлтын үр дүнг хадгална
        this.render();
    }

    applyFilter(filterType) {
        switch (filterType) {
            case 'bestSelling':
                this.filteredBooks = [...this.books].sort((a, b) => b.sales - a.sales);
                break;
            case 'mostExpensive':
                this.filteredBooks = [...this.books].sort((a, b) => b.price - a.price);
                break;
            case 'bestRated':
                this.filteredBooks = [...this.books].sort((a, b) => b.rating - a.rating);
                break;
            case 'mostRecent':
                this.filteredBooks = [...this.books].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
                break;
            default:
                this.filteredBooks = [...this.books];
        }
        this.saveToLocalStorage('filteredBooks', this.filteredBooks); // Шүүлтүүрийн үр дүнг хадгална
        this.render();
    }

    render() {
        const filterType = this.getFromLocalStorage('filterType') || 'all'; // LocalStorage-оос filterType авах
        this.shadowRoot.innerHTML = `
            <style>
                h2 {
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                    color: #333;
                }
            </style>
             <h2>${filterType === 'mostRecent' ? 'Хамгийн сүүлд оруулсан ном' :
                   filterType === 'bestSelling' ? 'Хамгийн их борлуулалттай ном' : 
                   filterType === 'bestRated' ? 'Хамгийн өндөр үнэлгээтэй ном' : 
                   filterType === 'mostExpensive' ? 'Хамгийн их үнэтэй ном' : 
                   'Бүх ном'}</h2>
            <book-list>
                ${this.filteredBooks.map(book => `
                    <book-item
                        name="${book.name}"
                        author="${book.author}"
                        pubDate="${book.pubDate}"
                        price="${book.price}"
                        image="${book.image}"
                        bookId="${book.id}"
                    ></book-item>
                `).join('')}
            </book-list>
        `;
    }

    saveToLocalStorage(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getFromLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    loadState() {
        const searchTerm = this.getFromLocalStorage('searchTerm') || '';
        document.querySelector('.search-container input').value = searchTerm;
        this.filteredBooks = this.getFromLocalStorage('filteredBooks') || this.books;

        const filterType = this.getFromLocalStorage('filterType') || 'all';
        document.querySelector('#categorySelect').value = filterType;
        this.applyFilter(filterType);
    }
}

customElements.define('book-module', BookModule);
