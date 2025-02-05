import { BasketComponent } from './components/basket-component.js';
import { BookmarkComponent } from './components/bookmark-count.js';
import { ThemeToggle } from './components/theme-toggle.js';
import './components/user-list.js';
import { TopMembers } from './components/TopMembers.js';
import { RecentBlogs } from './components/RecentBlogs.js';
import { AllBlogs } from './components/AllBlogs.js';
import { PricingSection } from './components/PricingSection.js';

import './components/book-module.js';  // book-module.js автоматаар `index.html` дээр ажиллана
import './components/book-list.js';
import './components/book-item.js';

// `book-module`, `basket-component` болон `bookmark-component`-ийг олж авах
const bookModule = document.querySelector('book-module');
const basketComponent = document.querySelector('basket-component');
const bookmarkComponent = document.querySelector('bookmark-component');

class BookBuddyApp {
    constructor() {
        this.basket = this.loadBasketFromLocalStorage();
        this.setupGlobalEventListeners();
        this.updateBasketDisplay();
    }

    setupGlobalEventListeners() {
        document.addEventListener('add-to-basket', (event) => {
            this.addToBasket(event.detail);
        });

        document.addEventListener('basket-updated', () => {
            this.updateBasketDisplay();
        });
    }

    addToBasket(book) {
        let basket = this.loadBasketFromLocalStorage();
        basket.push(book);
        this.saveBasketToLocalStorage(basket);
        this.updateBasketDisplay();

        // `basket-updated` эвент илгээж UI шинэчлэх
        document.dispatchEvent(new CustomEvent('basket-updated'));
    }

    updateBasketDisplay() {
        const basket = this.loadBasketFromLocalStorage();
        const basketCountElement = document.getElementById('basket-count');
        if (basketCountElement) {
            basketCountElement.textContent = basket.length;
        }
    }

    saveBasketToLocalStorage(basket) {
        localStorage.setItem('bookBasket', JSON.stringify(basket));
    }

    loadBasketFromLocalStorage() {
        return JSON.parse(localStorage.getItem('bookBasket')) || [];
    }
}

// DOM ачаалагдахад `BookBuddyApp`-ийг ажиллуулах
document.addEventListener('DOMContentLoaded', () => {
    new BookBuddyApp();
});
