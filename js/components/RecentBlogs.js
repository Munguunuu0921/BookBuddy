export class RecentBlogs extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Load the stored bookmarked blogs from localStorage
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedBlogs')) || [];
    this.bookmarkedBlogs = new Set(storedBookmarks);
    this.bookmarkCount = this.bookmarkedBlogs.size;
  }

  connectedCallback() {
    this.fetchRecentBlogs();
  }

  async fetchRecentBlogs() {
    try {
      const response = await fetch('http://localhost:3000/api/blogs');
      if (!response.ok) {
        throw new Error(`Failed to fetch blogs: ${response.statusText}`);
      }
      const blogs = await response.json();

      // Sort and slice to get the recent 3 blogs
      const recentBlogs = blogs
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);

      this.render(recentBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      this.shadowRoot.innerHTML = `<p>Failed to load blogs. Please try again later.</p>`;
    }
  }

  handleBookmark(blogId, icon) {
    // Toggle bookmark
    if (this.bookmarkedBlogs.has(blogId)) {
      this.bookmarkedBlogs.delete(blogId); // Remove from bookmarks
      icon.classList.remove('bookmarked'); // Remove the "bookmarked" style
      this.bookmarkCount--; // Decrease bookmark count
    } else {
      this.bookmarkedBlogs.add(blogId); // Add to bookmarks
      icon.classList.add('bookmarked'); // Add the "bookmarked" style
      this.bookmarkCount++; // Increase bookmark count
    }

    // Save updated bookmarks to localStorage
    localStorage.setItem('bookmarkedBlogs', JSON.stringify(Array.from(this.bookmarkedBlogs)));
    localStorage.setItem('bookmarkCount', JSON.stringify(this.bookmarkCount));

    // Update the bookmark count in the header
    this.dispatchEvent(new CustomEvent('update-bookmark-count', { detail: { count: this.bookmarkCount } }));
  }

  render(blogs) {
    const template = document.createElement('template');

    template.innerHTML = `
      <style>
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .blog-card { background-color: var(--color-main); border: 1px solid #e0e0e0; border-radius: 10px; transition: transform 0.3s ease; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; }
        .blog-card img { width: 100%; height: 200px; object-fit: cover; }
        .blog-card:hover { transform: scale(1.05); }
        .blog-content { padding: 1rem; }
        .blog-card h3 { font-size: 1.25rem; margin: 0.5rem 0; color: #333; }
        .blog-author { display: flex; align-items: center; margin-top: 15px; }
        .blog-author img { border-radius: 50%; width: 40px; height: 40px; object-fit: cover; margin-right: 10px; }
        .blog-author p { font-size: 1.1rem; color: var(--color-text-muted); }
        .blog-icons { display: flex; justify-content: space-between; margin-top: 15px; }
        .blog-icons a img { width: 20px; height: 20px; }
        .blog-icons a:hover { color: var(--color-accent); }
        
        .bookmark-icon.bookmarked img {
          filter: invert(50%) sepia(70%) saturate(500%) hue-rotate(150deg); /* Highlight bookmarked icons */
        }
          .blog-section h2 {
  margin-top: 90px;
}

        .all-blogs-btn {
          background-color: var(--color-main); 
          border: none;
          border-radius: 5px;
          padding: 10px 15px;
          font-size: 1rem;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          position: absolute;
          right: 20px;
        }

      </style>
      <section class="blog-section container">
        <h2>Блогууд</h2>
        <button id="all-blogs-btn" class="all-blogs-btn">Бүх блогууд харах</button>
        <div class="blog-grid">
          <slot></slot>
        </div>
      </section>
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const blogGrid = this.shadowRoot.querySelector('.blog-grid');

    blogs.forEach((blog) => {
      const blogTemplate = document.createElement('template');
      const isBookmarked = this.bookmarkedBlogs.has(blog.id); // Check if this blog is bookmarked

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
              <a class="bookmark-icon ${isBookmarked ? 'bookmarked' : ''}" data-id="${blog.id}">
                <img src="./svg/bookmark.svg" />
              </a>
            </div>
          </div>
        </div>
      `;
      blogGrid.appendChild(blogTemplate.content.cloneNode(true));
    });

    // Handle bookmark icon click to toggle bookmark state
    this.shadowRoot.querySelectorAll('.bookmark-icon').forEach((icon) => {
      icon.addEventListener('click', (event) => {
        const blogId = event.target.closest('.bookmark-icon').getAttribute('data-id');
        this.handleBookmark(blogId, icon); // Toggle bookmark state and update icon color
      });
    });

    // Handle the "All Blogs" button click event
    this.shadowRoot.querySelector('#all-blogs-btn').addEventListener('click', () => {
      window.location.href = 'allBlogs.html'; // Redirect to all blogs page
    });
  }
}

customElements.define('recent-blogs', RecentBlogs);
