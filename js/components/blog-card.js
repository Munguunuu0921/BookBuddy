// BlogCard.js
export default function BlogCard({ blog }) {
    return `
    <div class="blog-item">
      <img src="${blog.image}" alt="${blog.title}" class="blog-image" />
      <div class="blog-content">
        <h3>${blog.title}</h3>
        <p class="blog-date">${blog.date}</p>
        <p class="blog-excerpt">${blog.excerpt}</p>
        <div class="blog-author">
          <img src="${blog.authorImage}" alt="${blog.author}" class="author-image" />
          <p>${blog.author}</p>
        </div>
        <div class="blog-icons">
           <a href="#"><img src="./svg/comment-icon.svg" /></a>
            <a href="#"><img src="./svg/share-icon.svg" /></a>
            <a href="# "><img src="./svg/bookmark.svg" /></a>
        </div>
      </div>
    </div>
  `;
  }
  