document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Форма илгээхийг зогсооно

    const bookData = {
        bookId: document.getElementById('bookId').value,
        userId: document.getElementById('userId').value,
        userName: document.getElementById('userName').value,
        name: document.getElementById('name').value,
        author: document.getElementById('author').value,
        pubDate: document.getElementById('pubDate').value,
        price: document.getElementById('price').value,
        image: document.getElementById('image').value,
        commentCount: document.getElementById('commentCount').value,
        viewCount: document.getElementById('viewCount').value,
        paid: document.getElementById('paid').value === "true",
        rating: document.getElementById('rating').value,
        userImage: document.getElementById('userImage').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('responseMessage').textContent = 'Ном амжилттай нэмэгдлээ!';
            document.getElementById('bookForm').reset(); // Форма хоослох
        } else {
            document.getElementById('responseMessage').textContent = `Алдаа: ${result.error}`;
        }
    } catch (error) {
        console.error('Fetch алдаа:', error);
        document.getElementById('responseMessage').textContent = 'Сервертэй холбогдоход алдаа гарлаа!';
    }
});
