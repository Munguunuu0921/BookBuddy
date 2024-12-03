import { BookList } from './components/book-list.js';
import { BasketComponent } from './components/basket-component.js';
import { ThemeToggle } from './components/theme-toggle.js';
import BookManager from './components/book-module.js';
import BlogList from './components/blog-list.js';

document.addEventListener('DOMContentLoaded', () => {
  BlogList();
});


class BookBuddyApp {
    constructor() {
        this.basket = [];
        this.initializeComponents();
        this.setupGlobalEventListeners();
    }

    

    initializeComponents() {
        this.bookList = document.createElement('book-list');
        this.basketComponent = document.createElement('basket-component');
        this.bookmarkComponent = document.createElement('bookmark-component');
        this.themeToggle = document.createElement('theme-toggle');
        
        // Initialize BookManager
        this.bookManager = new BookManager(this.basketComponent);
        this.blogList = document.createElement('blog-list');
    }

    setupGlobalEventListeners() {
        // Global event handling across components
        document.addEventListener('add-to-basket', (event) => {
            this.addToBasket(event.detail);
        });

        this.basketComponent.addEventListener('basket-updated', (event) => {
            this.updateBasketDisplay(event.detail);
        });
    }

    renderApp() {
        const app = document.getElementById('app');
        
        // Create a document fragment for efficient rendering
        const fragment = document.createDocumentFragment();

        // Append components to the fragment
        fragment.appendChild(this.themeToggle);
        fragment.appendChild(this.basketComponent);
        fragment.appendChild(this.bookmarkComponent);
        // fragment.appendChild(this.UserModule);
        fragment.appendChild(this.bookList);
        fragment.appendChild(this.blogList);

        // Append the fragment to the app container
        app.appendChild(fragment);
    }

    // Method to add a book to the basket
    addToBasket(book) {
        // Check if book is already in basket
        const existingBookIndex = this.basket.findIndex(item => item.id === book.id);
        
        if (existingBookIndex > -1) {
            // Increment quantity if book already exists
            this.basket[existingBookIndex].quantity += 1;
        } else {
            // Add new book to basket with quantity 1
            this.basket.push({
                ...book,
                quantity: 1
            });
        }

        // Dispatch basket updated event
        this.basketComponent.dispatchEvent(new CustomEvent('basket-updated', {
            detail: this.basket
        }));

        // Save basket to localStorage
        this.saveBasketToLocalStorage();
    }

    // Method to update basket display
    updateBasketDisplay(basket) {
        const basketCountElement = document.getElementById('basket-count');
        if (basketCountElement) {
            const totalItems = basket.reduce((total, book) => total + book.quantity, 0);
            basketCountElement.textContent = totalItems;
        }
    }

    // Method to dynamically add a book to the list
    addBook(bookData) {
        const bookItem = document.createElement('book-item');
        bookItem.setAttribute('title', bookData.title);
        bookItem.setAttribute('author', bookData.author);
        bookItem.setAttribute('price', bookData.price);
        bookItem.setAttribute('image', bookData.image);
        
        this.bookList.appendChild(bookItem);
    }

    // Method to filter books
    filterBooks(category) {
        const books = this.bookList.querySelectorAll('book-item');
        books.forEach(book => {
            const matchesCategory = book.getAttribute('category') === category;
            book.style.display = matchesCategory ? 'block' : 'none';
        });
    }

    // Save basket to localStorage
    saveBasketToLocalStorage() {
        localStorage.setItem('bookBasket', JSON.stringify(this.basket));
    }

    // Load basket from localStorage
    loadBasketFromLocalStorage() {
        const savedBasket = localStorage.getItem('bookBasket');
        if (savedBasket) {
            this.basket = JSON.parse(savedBasket);
            this.basketComponent.dispatchEvent(new CustomEvent('basket-updated', {
                detail: this.basket
            }));
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const bookBuddyApp = new BookBuddyApp();
    bookBuddyApp.renderApp();
    bookBuddyApp.loadBasketFromLocalStorage();

    // Example of dynamically adding a book
    bookBuddyApp.addBook({
        title: 'New Awesome Book',
        author: 'John Writer',
        price: 19.99,
        image: './img/Book.png'
    });
});

export default BookBuddyApp;