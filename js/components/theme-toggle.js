export class ThemeToggle extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isDarkMode = localStorage.getItem('theme') === 'dark';
        // Биеийн өнгийг тохируулах
        if (this.isDarkMode) {
            document.body.classList.add('dark-mode');
        }
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                button {
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    cursor: pointer;
                    padding: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                svg {
                    width: 24px;
                    height: 24px;
                }
            </style>
            <button id="themeButton">
                ${this.isDarkMode ? this.getMoonSVG() : this.getSunSVG()}
            </button>
        `;
    }

    setupEventListeners() {
        const button = this.shadowRoot.querySelector('#themeButton');
        button.addEventListener('click', () => {
            this.isDarkMode = !this.isDarkMode;
            document.body.classList.toggle('dark-mode', this.isDarkMode);
            localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');

            // Зөвхөн товчны агуулгыг өөрчлөх
            button.innerHTML = this.isDarkMode ? this.getMoonSVG() : this.getSunSVG();
        });
    }

    getSunSVG() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" fill="orange"></circle>
                <line x1="12" y1="1" x2="12" y2="3" stroke="orange" stroke-width="2"></line>
                <line x1="12" y1="21" x2="12" y2="23" stroke="orange" stroke-width="2"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="orange" stroke-width="2"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="orange" stroke-width="2"></line>
                <line x1="1" y1="12" x2="3" y2="12" stroke="orange" stroke-width="2"></line>
                <line x1="21" y1="12" x2="23" y2="12" stroke="orange" stroke-width="2"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="orange" stroke-width="2"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="orange" stroke-width="2"></line>
            </svg>
        `;
    }

    getMoonSVG() {
        return `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.74 2.16c-.59-.11-1.2-.16-1.82-.16C6.48 2 2.84 5.65 2.84 10c0 4.35 3.65 8 8 8 4.16 0 7.77-3.24 7.98-7.36.02-.49-.39-.89-.88-.89-.59 0-1.16.1-1.71.29-.55.19-1.03.53-1.43.95-.4.43-.68.96-.82 1.54-.15.58-.15 1.18.03 1.74.18.56.5 1.08.91 1.49-.84-.17-1.71-.48-2.5-.97-1.59-.99-2.59-2.68-2.59-4.58 0-3.06 2.48-5.54 5.54-5.54 1.27 0 2.5.42 3.5 1.16-.43-.98-.99-1.89-1.67-2.69-.69-.81-1.49-1.51-2.36-2.1z" fill="#f4c20d"></path>
            </svg>
        `;
    }
}

// Define the custom element
customElements.define('theme-toggle', ThemeToggle);
