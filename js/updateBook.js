let currentBookId = null;

function openUpdateBookModal(bookId) {
  
  fetch(`http://localhost:3000/api/books/${bookId}`)
    .then(response => response.json())
    .then(book => {
     
      document.getElementById('bookName').value = book.name;
      document.getElementById('bookAuthor').value = book.author;
      document.getElementById('bookPubDate').value = book.pubDate;
      document.getElementById('bookPrice').value = book.price;

      document.getElementById('updateBookModal').style.display = 'block';


      currentBookId = bookId;
    })
    .catch(error => {
      console.error('Error fetching book data:', error);
      alert('Failed to load book data.');
    });
}

function closeModal() {
  document.getElementById('updateBookModal').style.display = 'none';
}

document.getElementById('updateBookForm').addEventListener('submit', function (event) {
  event.preventDefault(); 

  const updatedBook = {
    name: document.getElementById('bookName').value,
    author: document.getElementById('bookAuthor').value,
    pubDate: document.getElementById('bookPubDate').value,
    price: document.getElementById('bookPrice').value
  };

  // Send the updated data via a PUT request
  fetch(`http://localhost:3000/api/books/${currentBookId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedBook)
  })
    .then(response => {
      if (response.ok) {
        alert('Book updated successfully');
        loadBooks(); 
        closeModal(); 
      } else {
        alert('Failed to update the book.');
      }
    })
    .catch(error => {
      console.error('Error updating the book:', error);
      alert('Failed to update the book.');
    });
});
