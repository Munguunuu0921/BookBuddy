const CONFIG = {
    API_URL: 'https://api.jsonbin.io/v3/b/673ae58fad19ca34f8cbdcff',
    API_KEY: '$2a$10$yOu5Xw3tC6QY3iMiYx1W6O85I8Mb0HPpAVffLCpBrbu05CPJvpgLO',
    headers: {
      'X-Master-Key': '$2a$10$yOu5Xw3tC6QY3iMiYx1W6O85I8Mb0HPpAVffLCpBrbu05CPJvpgLO',
      'Content-Type': 'application/json',
    }
  };
  
  const filterFunctions = {
    bestSelling: (books) => [...books].sort((a, b) => b.salesCount - a.salesCount),
    mostExpensive: (books) => [...books].sort((a, b) => b.price - a.price),
    bestRated: (books) => [...books].sort((a, b) => b.rating - a.rating),
    mostRecent: (books) => [...books].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
  };
  
  class BookManager {
    constructor(basketComponent = null) {
      this.books = [];
      this.filteredBooks = [];
      this.basketComponent = basketComponent;
      this.searchInput = document.querySelector('.search-container input');
      this.filterSelect = document.querySelector('.search-container select');
      this.bookGrid = document.querySelector('.book-grid');
      
      this.init();
    }
  
    async init() {
      await this.fetchBooks();
      this.setupEventListeners();
      this.renderBooks(this.books);
    }
  
    async fetchBooks() {
      try {
        const response = await fetch(CONFIG.API_URL, {
          headers: CONFIG.headers
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const data = await response.json();
        this.books = data.record.books;
        this.filteredBooks = [...this.books];
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    }
  
    setupEventListeners() {
      this.searchInput.addEventListener('input', () => {
        this.filterBooks();
      });
  
      this.filterSelect.addEventListener('change', () => {
        this.filterBooks();
      });
  
      // Delegate event listener for basket buttons
      this.bookGrid.addEventListener('click', (event) => {
        const basketButton = event.target.closest('.basket-btn');
        if (basketButton) {
          const bookId = parseInt(basketButton.dataset.bookId);
          this.addToBasket(bookId);
        }
      });
    }
  
    filterBooks() {
      const searchTerm = this.searchInput.value.toLowerCase();
      const filterType = this.filterSelect.value;
  
      let filtered = this.books.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
      );
  
      switch (filterType) {
        case 'bestSelling':
          filtered = filterFunctions.bestSelling(filtered);
          break;
        case 'mostExpensive':
          filtered = filterFunctions.mostExpensive(filtered);
          break;
        case 'bestRated':
          filtered = filterFunctions.bestRated(filtered);
          break;
        case 'mostRecent':
          filtered = filterFunctions.mostRecent(filtered);
          break;
      }
  
      this.filteredBooks = filtered;
      this.renderBooks(filtered);
    }
  
    renderBooks(books) {
      this.bookGrid.innerHTML = books.map(book => `
        <div class="book-item">
          <img src="${book.coverImage}" alt="${book.title}" />
          <div class="book-info">
            <p><b>${book.title}</b></p>
            <p>${book.author}</p>
            <p>Rating: ${book.rating}★</p>
            <p>$${book.price.toFixed(2)}</p>
          </div>
          <div class="book-actions">
            <a class="user-circle" href="#"><img src="./img/1.jpg" /></a>
            <a href="#"><img src="./svg/chat.svg" /></a>
            <a href="#"><img src="./svg/eye.svg" /></a>
            <a href="#" class="basket-btn" data-book-id="${book.id}">
              <img src="./svg/basket.svg" />
            </a>
          </div>
        </div>
      `).join('');
    }
  
    addToBasket(bookId) {
      const book = this.books.find(b => b.id === bookId);
      
      if (book) {
        // Dispatch custom event to add book to basket
        document.dispatchEvent(new CustomEvent('add-to-basket', {
          detail: book
        }));
      }
    }
  }
  
  
  export default BookManager;