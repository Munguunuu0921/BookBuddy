import BlogCard from './blog-card.js';

export default async function BlogList() {
  const response = await fetch('https://api.jsonbin.io/v3/b/674c65eaacd3cb34a8b216dc', {
    headers: {
      'X-Master-Key': '$2a$10$yOu5Xw3tC6QY3iMiYx1W6O85I8Mb0HPpAVffLCpBrbu05CPJvpgLO',
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  const blogs = data.record; // JSON өгөгдлөөс блогийн жагсаалтыг авна.

  // Блог бүрийг харуулах
  const blogListHTML = blogs.map((blog) => BlogCard({ blog })).join('');
  document.querySelector('.blog-section').innerHTML = `
  <section class="blog-section container">
    <h2>Шинэ Блогууд</h2>
    <div class="blog-grid">
      ${blogListHTML}
    </div>
  </section>
  `;
}
