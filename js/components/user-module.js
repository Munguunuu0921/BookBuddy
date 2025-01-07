import { faker } from 'https://cdn.skypack.dev/faker';

class UserModule extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.users = [];
  }

  connectedCallback() {
    this.render();
    this.generateUsers();
  }

  // Generate random user data
  generateUsers(count = 20) {
    this.users = Array.from({ length: count }, () => ({
      id: crypto.randomUUID(),
      name: faker.person.fullName(),
      age: faker.number.int({ min: 18, max: 65 }),
      profession: faker.person.jobTitle(),
      email: faker.internet.email(),
      picture: this.getRandomProfilePicture(),
      homeAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: faker.location.country()
      }
    }));

    this.saveUsersToStorage();
    this.renderUserCircles();
  }

  // Get a random profile picture from predefined list
  getRandomProfilePicture() {
    const images = [
      './img/1.jpg', './img/2.jpg', './img/5.jpg', 
      './img/7.jpg', './img/8.jpg', './img/9.jpg', 
      './img/12.jpg', './img/13.jpg', './img/19.jpg'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  // Store users in local storage
  saveUsersToStorage() {
    localStorage.setItem('bookBuddyUsers', JSON.stringify(this.users));
  }

  // Render user circles
  renderUserCircles() {
    const circlesContainer = this.shadowRoot.querySelector('.user-circles');
    circlesContainer.innerHTML = '';

    this.users.forEach(user => {
      const circleDiv = document.createElement('div');
      circleDiv.className = 'user-circle-active';
      
      const img = document.createElement('img');
      img.src = user.picture;
      img.alt = user.name;
      
      const nameP = document.createElement('p');
      nameP.textContent = user.name;
      
      circleDiv.appendChild(img);
      circleDiv.appendChild(nameP);
      
      // Add click event to show user details
      circleDiv.addEventListener('click', () => this.showUserDetails(user));
      
      circlesContainer.appendChild(circleDiv);
    });
  }

  // Show user details (can be expanded to a modal)
  showUserDetails(user) {
    console.log('User Details:', user);
    // TODO: Implement a modal or detailed view
  }

  // Render method to set up the initial component structure
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .user-circles {
          display: flex;
          overflow-x: auto;
          gap: 15px;
          padding: 10px 0;
        }
        .user-circle-active {
          flex: 0 0 auto;
          text-align: center;
          cursor: pointer;
        }
        .user-circle-active img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        .user-circle-active p {
          margin-top: 10px;
          font-size: 0.9em;
        }
      </style>
      <div class="user-circles"></div>
    `;
  }
}

// Define the custom element
customElements.define('user-module', UserModule);

export default UserModule;