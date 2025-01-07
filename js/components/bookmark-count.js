export class BookmarkComponent extends HTMLElement {
    constructor() {
      super();
      // Load the stored bookmark count from localStorage
      this.bookmarkCount = JSON.parse(localStorage.getItem('bookmarks'))?.length || 0;
    }
  
    connectedCallback() {
      this.render();
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      // Listen for bookmark count updates
      document.addEventListener('update-bookmark-count', () => {
        this.updateBookmarkCount();
      });
    }
  
    updateBookmarkCount() {
      // Update bookmark count and save to localStorage
      this.bookmarkCount = getBookmarks().length;
      localStorage.setItem('bookmarksCount', JSON.stringify(this.bookmarkCount));
  
      const countElement = this.querySelector('.item-count');
      if (countElement) {
        countElement.textContent = this.bookmarkCount;
      }
    }
  
    render() {
      this.innerHTML = `
        <nav class="header-icons">
          <a href="saveBlogs.html" class="bookmark-link">
            <img src="./svg/bookmark.svg" alt="Bookmark" />
            <span class="item-count">${this.bookmarkCount}</span>
          </a>
        </nav>
      `;
    }
  }
  
  customElements.define('bookmark-component', BookmarkComponent);
  