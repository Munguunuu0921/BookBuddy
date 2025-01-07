const CONFIG = {
    LOCAL_API_URL: 'http://localhost:3000/api/books',
    API_URL: 'https://api.jsonbin.io/v3/b/673ae58fad19ca34f8cbdcff',
    API_KEY: '$2a$10$yOu5Xw3tC6QY3iMiYx1W6O85I8Mb0HPpAVffLCpBrbu05CPJvpgLO',
    headers: {
        'X-Master-Key': '$2a$10$yOu5Xw3tC6QY3iMiYx1W6O85I8Mb0HPpAVffLCpBrbu05CPJvpgLO',
        'Content-Type': 'application/json',
    }
};

const filterFunctions = {
    bestSelling: (books) => [...books].sort((a, b) => b.viewCount - a.viewCount),
    mostExpensive: (books) => [...books].sort((a, b) => b.price - a.price),
    bestRated: (books) => [...books].sort((a, b) => b.rating - a.rating),
    mostRecent: (books) => [...books].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
};

class BookManager {
    constructor(basketComponent = null) {
        this.books = [];
        this.filteredBooks = [];
        this.basketComponent = basketComponent;
        this.searchInput = document.querySelector('.search-container input');
        this.filterSelect = document.querySelector('.search-container select');
        this.bookGrid = document.querySelector('.book-section');
        this.latestBookSection = document.querySelector('.latest-book-section');
        this.init();
    }

    async init() {
        await this.fetchBooks();
        this.setupEventListeners();
        this.renderBooks(this.books);
        this.renderLatestBook();
    }

    // Номны өгөгдлийг татах
    async fetchBooks() {
        try {
            console.log('Local API-аас өгөгдөл татаж эхэллээ...');
            const localResponse = await fetch(CONFIG.LOCAL_API_URL);
            if (localResponse.ok) {
                const data = await localResponse.json();
                console.log('Local API-аас өгөгдөл:', data);
                this.books = data;
            } else {
                throw new Error('Local server unavailable');
            }
        } catch (error) {
            console.warn('Local сервер ашиглах боломжгүй. Алсын сервер рүү шилжиж байна.', error);
            const response = await fetch(CONFIG.API_URL, { headers: CONFIG.headers });
            const data = await response.json();
            console.log('Remote API-аас өгөгдөл:', data);
            this.books = data.record.books;
        }
        this.filteredBooks = [...this.books];
        console.log('Номны нийт өгөгдөл:', this.books);
    }    

    // Ивэнтүүдийг суулгах
    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterBooks());
        this.filterSelect.addEventListener('change', () => this.filterBooks());
        this.bookGrid.addEventListener('click', (event) => this.handleBasketButtonClick(event));
        this.latestBookSection.addEventListener('click', (event) => this.handleBasketButtonClick(event));
    }

    // Сагсны товч дарах ивэнт
    handleBasketButtonClick(event) {
        const basketButton = event.target.closest('.basket-btn');
        if (basketButton) {
            const bookId = parseInt(basketButton.dataset.bookId);
            console.log('Сагсны товч дарагдлаа. bookId:', bookId);
            this.addToBasket(bookId);
        } else {
            console.warn('Сагсны товчлуур олоогүй.');
        }
    }    

    // Шүүлтүүр хийх
    filterBooks() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filterType = this.filterSelect.value;
        console.log('Хайлт:', searchTerm, 'Шүүлтүүр:', filterType);
    
        let filtered = this.books.filter(book =>
            (book.name && book.name.toLowerCase().includes(searchTerm)) ||
            (book.author && book.author.toLowerCase().includes(searchTerm))
        );
        console.log('Шүүлтүүрт нийцсэн номнууд:', filtered);
    
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
    
        console.log('Эцсийн шүүгдсэн номнууд:', filtered);
        this.filteredBooks = filtered;
        this.renderBooks(filtered, filterType);
    }    

    // Номуудыг рендерлэх
    renderBooks(books, filterType = '') {
        console.log(`Рендерлэх номууд (${filterType}):`, books);
        this.bookGrid.innerHTML = `
            <h2>${filterType === 'mostRecent' ? 'Хамгийн сүүлд оруулсан ном' :
                   filterType === 'bestSelling' ? 'Хамгийн их борлуулалттай ном' : 
                   filterType === 'bestRated' ? 'Хамгийн өндөр үнэлгээтэйгээр эрэмбэлсэн ном' : 
                   filterType === 'mostExpensive' ? 'Хамгийн их үнэтэйгээр эрэмбэлсэн ном' : 
                   'Бүх ном'}</h2>
            <div class="book-slider">
                ${books.map(book => `
                    <div class="book-item">
                        <img src="${book.image}" alt="${book.name}" />
                        <div class="book-info">
                            <p><b>${book.name}</b></p>
                            <p>${book.author}</p>
                            <p>Rating: ${book.rating}★</p>
                            <p>${new Date(book.pubDate).toLocaleDateString()}</p>
                            <p>$${book.price.toFixed(2)}</p>
                        </div>
                        <div class="book-actions">
                            <a class="user-circle" href="#">
                                <img src="${book.userImage || './img/1.jpg'}" />
                            </a>
                            <a href="#"><img src="./svg/chat.svg" /></a>
                            <a href="#"><img src="./svg/eye.svg" /></a>
                            <a href="#" class="basket-btn" data-book-id="${book.bookId}">
                                <img src="./svg/basket.svg" />
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        this.enableSlider();
    }    

    renderLatestBook() {
        // Бүх номуудыг хамгийн сүүлд оруулсан нь эхэнд байрлаж байхаар эрэмбэлэх
        const sortedBooks = this.books.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      
        // Хэрэв ном байхгүй бол буцна
        if (sortedBooks.length === 0) return;
      
        // `latest-book-section`-д агуулга нэмэх
        this.latestBookSection.innerHTML = `
          <h2>Хамгийн сүүлд оруулсан номууд</h2>
          <div class="book-slider">
            ${sortedBooks
              .map(
                (book) => `
              <div class="book-item">
                <img src="${book.image}" alt="${book.name}" />
                <div class="book-info">
                  <p><b>${book.name}</b></p>
                  <p>${book.author}</p>
                  <p>Rating: ${book.rating}★</p>
                  <p>${new Date(book.pubDate).toLocaleDateString()}</p>
                  <p>$${book.price.toFixed(2)}</p>
                </div>
                <div class="book-actions">
                  <a class="user-circle" href="#">
                    <img src="${book.userImage || './img/1.jpg'}" />
                  </a>
                  <a href="#"><img src="./svg/chat.svg" /></a>
                  <a href="#"><img src="./svg/eye.svg" /></a>
                  <a href="#" class="basket-btn" data-book-id="${book.bookId}">
                    <img src="./svg/basket.svg" />
                  </a>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        `;
      
        // Slider-г идэвхжүүлэх
        this.enableLatestSlider();
      }

    // Слайдер идэвхжүүлэх
    enableSlider() {
        const slider = this.bookGrid.querySelector('.book-slider');
        if (slider) {
            slider.style.display = 'flex';
            slider.style.overflowX = 'auto';
            slider.style.scrollSnapType = 'x mandatory';
            slider.style.gap = '1rem';
        }
    }

    enableLatestSlider() {
        const latestSlider = this.latestBookSection.querySelector('.book-slider');
        if (latestSlider) {
            latestSlider.style.display = 'flex';
            latestSlider.style.overflowX = 'auto';
            latestSlider.style.scrollSnapType = 'x mandatory';
            latestSlider.style.gap = '1rem';
        }
      }


    // Сагсанд ном нэмэх
    async addToBasket(bookId) {
        const book = this.books.find(b => b.bookId === bookId);
    
        if (!book) {
            console.warn('Ном олдсонгүй:', bookId);
            alert('Ном олдсонгүй.');
            return;
        }
    
        if (!book.name || !book.price || !book.bookId) {
            console.error('Номны өгөгдөл бүрэн биш байна:', book);
            alert('Номны өгөгдөл бүрэн биш байна.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/basket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(book),
            });
    
            if (!response.ok) {
                console.error('Server response error:', response.status);
                throw new Error('Failed to add book to basket');
            }
    
            const data = await response.json();
            document.dispatchEvent(new CustomEvent('add-to-basket', { detail: book }));
            alert('Ном амжилттай сагсанд нэмэгдлээ!');
        } catch (error) {
            console.error('Error adding book to basket:', error);
            alert('Сагсанд нэмэх үед алдаа гарлаа.');
        }
    }    
    
}    

export default BookManager;
