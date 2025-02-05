export class BookList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .book-slider {
                    display: flex; /* Flexbox ашиглаж мөрийн дагуу харуулах */
                    gap: 1rem;
                    overflow-x: auto; /* Хэвтээ чиглэлд гүйлгэх боломжтой болгоно */
                    padding: 10px;
                    scroll-behavior: smooth; /* Гүйх үед зөөлөн анимац */
                }
                .book-slider::-webkit-scrollbar {
                    height: 8px;
                    background: #f0f0f0; /* Scrollbar-ийн дэвсгэр өнгө */
                }
                .book-slider::-webkit-scrollbar-thumb {
                    background: #bbb; /* Scrollbar-ийн хөтлөгч */
                    border-radius: 5px;
                }
                .book-slider::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }
            </style>
            <div class="book-slider">
                <slot></slot>
            </div>
        `;
    }
}

customElements.define('book-list', BookList);
