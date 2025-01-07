import { BookList } from './components/book-list.js';
import { BasketComponent } from './components/basket-component.js';
import { BookmarkComponent } from './components/bookmark-count.js';
import { ThemeToggle } from './components/theme-toggle.js';
import BookManager from './components/book-module.js';
import './components/user-list.js';

import { TopMembers } from './components/TopMembers.js';
import { RecentBlogs } from './components/RecentBlogs.js';
import { AllBlogs } from './components/AllBlogs.js';
import { PricingSection } from './components/PricingSection.js';

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
        this.bookManager = new BookManager(this.basketComponent);
        this.blogList = document.createElement('blog-list');
    }

    setupGlobalEventListeners() {
        document.addEventListener('add-to-basket', (event) => {
            this.addToBasket(event.detail);
        });

        this.basketComponent.addEventListener('basket-updated', (event) => {
            this.updateBasketDisplay(event.detail);
        });
    }

    renderApp() {
        const app = document.getElementById('app');
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.themeToggle);
        fragment.appendChild(this.basketComponent);
        fragment.appendChild(this.bookmarkComponent);
        fragment.appendChild(this.bookList);
        fragment.appendChild(this.blogList);
        app.appendChild(fragment);
    }

    addToBasket(book) {
        const existingBookIndex = this.basket.findIndex(item => item.id === book.id);
        if (existingBookIndex > -1) {
            this.basket[existingBookIndex].quantity += 1;
        } else {
            this.basket.push({ ...book, quantity: 1 });
        }

        this.basketComponent.dispatchEvent(new CustomEvent('basket-updated', {
            detail: this.basket
        }));

        this.saveBasketToLocalStorage();
    }

    updateBasketDisplay(basket) {
        const basketCountElement = document.getElementById('basket-count');
        if (basketCountElement) {
            const totalItems = basket.reduce((total, book) => total + book.quantity, 0);
            basketCountElement.textContent = totalItems;
        }
    }

    addBook(bookData) {
        const bookItem = document.createElement('book-item');
        bookItem.setAttribute('title', bookData.title);
        bookItem.setAttribute('author', bookData.author);
        bookItem.setAttribute('price', bookData.price);
        bookItem.setAttribute('image', bookData.image);
        this.bookList.appendChild(bookItem);
    }

    filterBooks(category) {
        const books = this.bookList.querySelectorAll('book-item');
        books.forEach(book => {
            const matchesCategory = book.getAttribute('category') === category;
            book.style.display = matchesCategory ? 'block' : 'none';
        });
    }

    saveBasketToLocalStorage() {
        localStorage.setItem('bookBasket', JSON.stringify(this.basket));
    }

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

document.addEventListener('DOMContentLoaded', () => {
    const bookBuddyApp = new BookBuddyApp();
    bookBuddyApp.renderApp();
    bookBuddyApp.loadBasketFromLocalStorage();
    bookBuddyApp.addBook({
        title: 'New Awesome Book',
        author: 'John Writer',
        price: 19.99,
        image: './img/Book.png'
    });
});

export default BookBuddyApp;
