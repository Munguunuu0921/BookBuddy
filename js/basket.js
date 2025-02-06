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
                <p class="book-description">Номын хэвлэлтийн огноо: ${new Date(book.pubDate).toLocaleDateString()}</p>
                <p class="book-description">Номын үнэ: ${book.price}</p>
            </div>
            <div class="reviewer">
                <img src="${book.userImage}" alt="${book.userName}" class="reviewer-avatar" />
                <span class="reviewer-name">${book.userName}</span>
                <div class="action-buttons">
                    <button class="action-button remove-btn" data-id="${book.bookId}">Устгах</button>
                    <button onclick="window.location.href='selectChat.html';" class="action-button swap-btn">Солилцох</button>
                    <button onclick="window.location.href='payment.html';" class="action-button pay-btn">Төлөх</button>
                </div>
            </div>
        </div>
    `;

    // Устгах товч дээр дарсан үйлдлийг холбох
    card.querySelector('.remove-btn').addEventListener('click', async () => {
        try {
            await moveToBooks(book.bookId, book);
            card.remove(); // DOM-оос устгах
            updateBasketCount(headerBasketCount, -1);
        } catch (error) {
            console.error('Алдаа гарлаа:', error);
            alert('Номыг устгах эсвэл book хүснэгт рүү нэмэх үед алдаа гарлаа.');
        }
    });

    return card;
}

async function moveToBooks(bookId, bookDetails) {
    try {
        console.log('Adding book to book table:', bookDetails);  // Log book details

        // "book" хүснэгтэд нэмэх API хүсэлт
        const addResponse = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookDetails),
        });

        if (!addResponse.ok) {
            const errorData = await addResponse.json();
            console.error('Error adding book to book table:', errorData);
            throw new Error(`Error: ${errorData.error || 'Номыг нэмэх үед алдаа гарлаа.'}`);
        }

        console.log('Book added successfully to the book table.');

        // "basket" хүснэгтээс устгах хүсэлт
        const removeResponse = await fetch(`http://localhost:3000/api/basket/${bookId}`, {
            method: 'DELETE',
        });

        if (!removeResponse.ok) {
            const errorData = await removeResponse.json();
            console.error('Error removing book from basket:', errorData);
            throw new Error(`Error: ${errorData.error || 'Сагснаас устгах үед алдаа гарлаа.'}`);
        }

        console.log('Book successfully removed from basket.');

        // Амжилттай болсныг харуулах
        alert('Ном амжилттай сагснаас устгаж, book хүснэгт рүү нэмэгдлээ.');

        // DOM-оос номыг устгах
        document.getElementById(`book-${bookId}`).remove();

    } catch (error) {
        console.error('Error during moveToBooks:', error);
        alert('Номыг устгах эсвэл book хүснэгт рүү нэмэх үед алдаа гарлаа.');
    }
}


function updateBasketCount(headerBasketCount, change) {
    const currentCount = parseInt(headerBasketCount.title.replace(/\D/g, ''), 10) || 0;
    const newCount = Math.max(0, currentCount + change);
    headerBasketCount.title = `(${newCount})`;
}
