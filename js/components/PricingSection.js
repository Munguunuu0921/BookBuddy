export class PricingSection extends HTMLElement {
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
          .pricing-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            position: relative;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 2rem;
          }
          .pricing-item {
            text-align: center;
            background-color: var(--color-white);
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .pricing-item .card-header {
            font-size: 1.25rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }
          .card-header.free-header {
            background-color: var(--color-green);
            color: var(--color-white);
            padding: 0.5rem;
            border-radius: 5px;
          }
          .card-header.premium-header {
            background-color: var(--color-main);
            color: var(--color-gray);
            padding: 0.5rem;
            border-radius: 5px;
          }
            .pricing-section h2 {
  margin-top: 90px;
}
          .card-content ul {
            list-style: none;
            padding: 1.5rem;
            padding: 0;
            margin: 0;
            text-align: left;
          }
          .card-content li {
            margin: 0.5rem 0;
            padding-left: 1rem;
            position: relative;
            font-size: 14px;
            color: #666;
          }
          .price-button {
            display: inline-block;
            width: 100%;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background-color: #f5f5f5;
            color: var(--color-gray);
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .price-button:hover {
            background-color: var(--color-lightgray);
          }
        </style>
        <section class="pricing-section container">
          <h2>Төлбөр</h2>
          <div class="pricing-grid">
            <div class="pricing-item">
              <div class="card-header free-header">Үнэгүй</div>
              <div class="card-content">
                <ul>
                  <li>Suspendisse porta ipsum eget sperm</li>
                  <li>Praesent vitae nunc eu diam rutrum</li>
                  <li>Fusce bibendum varius ex diam</li>
                  <li>Sed vitae magna eros in non venenatis</li>
                  <li>Morbi ut ornare lacus</li>
                </ul>
                <button class="price-button">0 төгрөг</button>
              </div>
            </div>
            <div class="pricing-item">
              <div class="card-header premium-header">Сарын</div>
              <div class="card-content">
                <ul>
                  <li>Suspendisse porta ipsum eget sperm</li>
                  <li>Praesent vitae nunc eu diam rutrum</li>
                  <li>Fusce bibendum varius ex diam</li>
                  <li>Sed vitae magna eros in non venenatis</li>
                  <li>Morbi ut ornare lacus</li>
                </ul>
                <button class="price-button">x төгрөг</button>
              </div>
            </div>
            <div class="pricing-item">
              <div class="card-header premium-header">Хамтрагчид</div>
              <div class="card-content">
                <ul>
                  <li>Suspendisse porta ipsum eget sperm</li>
                  <li>Praesent vitae nunc eu diam rutrum</li>
                  <li>Fusce bibendum varius ex diam</li>
                  <li>Sed vitae magna eros in non venenatis</li>
                  <li>Morbi ut ornare lacus</li>
                </ul>
                <button class="price-button">x төгрөг</button>
              </div>
            </div>
          </div>
        </section>
      `;
    }
  }
  
  customElements.define('pricing-section', PricingSection);
  