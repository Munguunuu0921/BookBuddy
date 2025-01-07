export class TopMembers extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }
  
    connectedCallback() {
      this.fetchTopMembers();
    }
  
    async fetchTopMembers() {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        const users = await response.json();
  
        // Sort users by rating in descending order and get the top 4
        const topMembers = users
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
  
        this.render(topMembers);
      } catch (error) {
        console.error('Error fetching top members:', error);
        this.shadowRoot.innerHTML = `<p>Failed to load top members. Please try again later.</p>`;
      }
    }
  
    render(members) {
      this.shadowRoot.innerHTML = `
        <style>
          .member-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
          }
          .top-member {
            text-align: center;
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
            h2 {
  margin-top: 90px;
}
          .top-member img {
            width: 100px;
            height: 100px;
            border-radius: 50%;
          }
          .top-member p {
            margin: 0.5rem 0;
          }
        </style>
        <section class="top-members container">
        <h2>Шилдэг гишүүд</h2>
        <div class="member-grid">
          ${members
            .map(
              (member) => `
              <div class="top-member">
                <img src="${member.image}" alt="${member.name}" />
                <p>${member.name}</p>
                <p>Rating: ★★★★★ (${member.rating})</p>
                <p>Book: ${member.bookCount} ширхэг</p>
                <p>Blog: ${member.BlogCount} ширхэг</p>
              </div>
            `
            )
            .join('')}
        </div>
        </section>
      `;
    }
  }
  
  customElements.define('top-members', TopMembers);
  