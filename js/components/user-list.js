export class UserList extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }); // Shadow DOM ашиглаж байна
      
    }
  
    // Component-ийн HTML-г тодорхойлох
    connectedCallback() {
      this.render();
      this.fetchUsers(); // Хэрэглэгчийн мэдээллийг серверээс авах
    }
  
    // HTML агуулга
    render(users = []) {
        this.shadowRoot.innerHTML = `
          <style>
            .user-circles {
              display: flex;
              overflow-x: auto;
              scroll-snap-type: x mandatory;
              scroll-padding: 1rem;
              gap: 1rem;
              padding: 1rem 0;
              -ms-overflow-style: none; /* Internet Explorer-д зориулсан */
              scrollbar-width: none; /* Firefox-д зориулсан */
            }
    
            .user-circle {
              flex: 0 0 auto;
              scroll-snap-align: start;
              
            }
    
            .user-circle img {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              border: 3px solid var(--color-secondary);
            }
    
            .user-circle.active img {
              border: 3px solid var(--color-secondary);
            }
    
            .user-circle p {
              margin-top: 0.5rem;
              font-weight: bold;
            }
          </style>
          <div class="user-circles">
            ${users.map(
              (user) => `
                <div class="user-circle">
                  <img src="${user.image}" alt="${user.name}">
                  <p>${user.name}</p>
                </div>
              `
            ).join('')}
          </div>
        `;
    }
  
    // Серверээс хэрэглэгчийн мэдээлэл авах
    async fetchUsers() {
      try {
        // Attempt to fetch the data from the API
        const response = await fetch('http://localhost:3000/api/users'); // Server endpoint
    
        // Check if the response is okay (status code 200-299)
        if (!response.ok) {
          // If not, throw an error with the status code
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        // Parse the response JSON into a JavaScript object
        const users = await response.json();
    
        // Render the fetched user data to the component
        this.render(users);
      } catch (error) {
        // If there was an error, log it to the console
        console.error('Error occurred:', error);
        
        // Optionally, you can render an error message to the component's shadow DOM
        this.shadowRoot.innerHTML = `<p>Error occurred: ${error.message}</p>`;
      }
    }
    
  }
  
  // Custom элемент бүртгэх
  customElements.define('user-list', UserList);
  