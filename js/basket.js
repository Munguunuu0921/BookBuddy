document.addEventListener("DOMContentLoaded", () => {
    const basketContainer = document.getElementById("basket-container");
  
    function loadBasket() {
      const basket = JSON.parse(localStorage.getItem("basket")) || [];
  
      if (basket.length === 0) {
        basketContainer.innerHTML = `
        <section>
          <p>Танд одоогоор сагсалсан ном байхгүй байна.<p>
          <button onclick="window.location.href='index.html';" class="back-button">Буцах</button>
        </section>
          <div class="illustration">
          <img src="./img/girl2.png" alt="Girl reading a book illustration" />
        </div>
        `;
        return;
      }
  
      basketContainer.innerHTML = basket
        .map(
          (book) => `
          <div class="selected-book-card">
            <img src="${book.image}" alt="${book.name}" class="book-image" />
            <div class="book-details-text">
              <div class="book-info">
                <h2 class="book-title">Номын нэр: ${book.name}</h2>
                <p class="book-description">Номын зохиолч: ${book.author}</p>
                <p class="book-description">Номын хэвлэлтийн огноо: ${new Date(
                  book.pubDate).toLocaleDateString()}</p>
                <p class="book-description">Номын төрөл: ${book.category || "N/A"}</p>
                <p class="book-description">Номын горим: ${book.format || "N/A"}</p>
                <p class="book-description">Зар оруулсан өдөр: ${
                  book.pubDate || "N/A"
                }</p>
                <p class="book-description">Ном зээлэх үнэ: ${
                  book.price || "N/A"
                }</p>
                <p class="book-description">Номын үнэ: $${book.price}</p>
              </div>
              <div class="reviewer">
                <img src="${book.userImage}" alt="Reviewer" class="reviewer-avatar" />
                <span class="reviewer-name">${book.userName || "Нэр"}</span>
              
              <div class="action-buttons">
                <button class="action-button remove-btn" data-id="${
                  book.bookId
                }">Устгах</button>
                <button onclick="window.location.href='selectChat.html';" class="action-button swap-btn">Солилцох</button>
                <button onclick="window.location.href='payment.html';" class="action-button pay-btn">Төлөх</button>
              </div>
              </div>
            </div>
          </div>
        `
        )
        .join("");
  
      document.querySelectorAll(".remove-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const bookId = event.target.getAttribute("data-id");
          removeBookFromBasket(bookId);
        });
      });
    }
  
    function removeBookFromBasket(bookId) {
      let basket = JSON.parse(localStorage.getItem("basket")) || [];
      basket = basket.filter((book) => book.bookId !== bookId);
      localStorage.setItem("basket", JSON.stringify(basket));
      loadBasket();
    }
  
    loadBasket();
  });
  