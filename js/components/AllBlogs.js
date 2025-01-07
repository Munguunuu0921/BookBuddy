// Utility functions for bookmark management
function saveBookmark(blog) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    if (!bookmarks.some((b) => b.id === blog.id)) {
      bookmarks.push(blog);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
  }
  
  function removeBookmark(blogId) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarks = bookmarks.filter((b) => b.id !== blogId);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  
  function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarks')) || [];
  }
  
  function isBookmarked(blogId) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    return bookmarks.some((b) => b.id === blogId);
  }
  
  export class AllBlogs extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.fetchAllBlogs();
    }
  
    async fetchAllBlogs() {
      try {
        const response = await fetch('http://localhost:3000/api/blogs'); // Fetch all blogs
        if (!response.ok) {
          throw new Error(`Failed to fetch blogs: ${response.statusText}`);
        }
        const blogs = await response.json();
        this.render(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        this.shadowRoot.innerHTML = `<p>Failed to load blogs. Please try again later.</p>`;
      }
    }
  
    render(blogs) {
      const template = document.createElement('template');
      template.innerHTML = `
        <style>
          .blog-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 1.5rem; 
          }
          .blog-card { 
            background-color: var(--color-main); 
            border: 1px solid #e0e0e0; 
            border-radius: 10px; 
            transition: transform 0.3s ease; 
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
            overflow: hidden; 
          }
          .blog-card img { 
            width: 100%; 
            height: 200px; 
            object-fit: cover; 
          }
          .blog-card:hover { 
            transform: scale(1.05); 
          }
          .blog-content { 
            padding: 1rem; 
          }
          .blog-card h3 { 
            font-size: 1.25rem; 
            margin: 0.5rem 0; 
            color: #333; 
          }
          .blog-author { 
            display: flex; 
            align-items: center; 
            margin-top: 15px; 
          }
          .blog-author img { 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            object-fit: cover; 
            margin-right: 10px; 
          }
          .blog-author p { 
            font-size: 1.1rem; 
            color: var(--color-text-muted); 
          }
          .blog-icons { 
            display: flex; 
            justify-content: space-between; 
            margin-top: 15px; 
          }
          .blog-icons a img { 
            width: 20px; 
            height: 20px; 
          }
          .bookmark-icon.bookmarked img {
            filter: invert(50%) sepia(70%) saturate(500%) hue-rotate(150deg); /* Highlight bookmarked icons */
          }
        </style>
        <section class="blog-section container">
          <h2>Бүх Блог</h2>
          <div class="blog-grid">
            <slot></slot>
          </div>
        </section>
      `;
  
      this.shadowRoot.innerHTML = '';
      this.shadowRoot.appendChild(template.content.cloneNode(true));
  
      const blogGrid = this.shadowRoot.querySelector('.blog-grid');
  
      blogs.forEach((blog) => {
        const isBookmarkedBlog = isBookmarked(blog.id);
        const blogTemplate = document.createElement('template');
        blogTemplate.innerHTML = `
          <div class="blog-card">
            <img src="${blog.image}" alt="${blog.name}" />
            <div class="blog-content">
              <h3>${blog.name}</h3>
              <p>${new Date(blog.date).toLocaleDateString()}</p>
              <p>${blog.description}</p>
              <div class="blog-author">
                <img src="${blog.userImage}" alt="${blog.userName}" />
                <p>${blog.userName}</p>
              </div>
              <div class="blog-icons">
                <a href="#"><img src="./svg/chat.svg" /></a>
                <a href="#"><img src="./svg/eye.svg" /></a>
                <a class="bookmark-icon ${isBookmarkedBlog ? 'bookmarked' : ''}" data-id="${blog.id}">
                  <img src="./svg/bookmark.svg" />
                </a>
              </div>
            </div>
          </div>
        `;
        blogGrid.appendChild(blogTemplate.content.cloneNode(true));
      });
  
      // Handle bookmark icon click
      this.shadowRoot.querySelectorAll('.bookmark-icon').forEach((icon) => {
        icon.addEventListener('click', (event) => {
          const blogId = event.target.closest('.bookmark-icon').getAttribute('data-id');
          const blog = blogs.find((b) => b.id == blogId);
  
          if (isBookmarked(blogId)) {
            // Remove from bookmarks
            removeBookmark(blogId);
            icon.classList.remove('bookmarked');
          } else {
            // Add to bookmarks
            saveBookmark(blog);
            icon.classList.add('bookmarked');
          }
  
          // Dispatch event to update bookmark count in other components
          document.dispatchEvent(new CustomEvent('update-bookmark-count'));
        });
      });
    }
  }
  
  customElements.define('all-blogs', AllBlogs);
  