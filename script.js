let booklist = [];
let currentPage = 1;
let itemsPerPage = 6;

const fetchBooksBtn = document.querySelector('#fetchbooks');
const mainContainer = document.querySelector('#books-container');
const paginationContainer = document.querySelector('#pagination-container');
const searchInput = document.querySelector('#search');
const sortingInput = document.querySelector('#sorting');

// Fetch books data from API
fetchBooksBtn.addEventListener('click', async () => {
    await fetch('https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=QTd4H7HDVpLKhqIqtV42NmAthrt8ub4b')
        .then((response) => response.json())
        .then((data) => {
            booklist = data.results.books;
            currentPage = 1; // Reset to first page
            displayBooks();
        })
        .catch((error) => console.error('Error fetching data:', error));
});

// Display books based on filters and sorting
function displayBooks() {
    mainContainer.innerHTML = '';
    let filteredBooks = booklist.filter(book =>
        book.title.toLowerCase().includes(searchInput.value.toLowerCase())
    );

    // Sort books
    const sortOption = sortingInput.value;
    if (sortOption === 'title-asc') {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'title-desc') {
        filteredBooks.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOption === 'author-asc') {
        filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortOption === 'author-desc') {
        filteredBooks.sort((a, b) => b.author.localeCompare(a.author));
    }

    // Paginate books
    const totalItems = filteredBooks.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

    // Display books
    for (let book of paginatedBooks) {
        const bookDiv = document.createElement('div');
        bookDiv.classList.add('book-item');
        
        const img = document.createElement('img');
        img.src = book.book_image;
        img.alt = book.title;

        const bookInfo = document.createElement('div');
        bookInfo.classList.add('book-info');

        const title = document.createElement('h3');
        title.textContent = book.title;
        
        const author = document.createElement('p');
        author.textContent = `Author: ${book.author}`;

        const description = document.createElement('p');
        description.textContent = book.description;

        bookInfo.appendChild(title);
        bookInfo.appendChild(author);
        bookInfo.appendChild(description);

        bookDiv.appendChild(img);
        bookDiv.appendChild(bookInfo);
        mainContainer.appendChild(bookDiv);
    }

    displayPagination(totalItems);
}

// Search functionality
searchInput.addEventListener('input', () => {
    currentPage = 1;
    displayBooks();
});

// Sorting functionality
sortingInput.addEventListener('change', () => {
    displayBooks();
});

// Pagination logic
function displayPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    paginationContainer.innerHTML = '';

    // Handle edge case where there are no items
    if (totalPages === 0) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;

        if (i === currentPage) {
            pageButton.style.backgroundColor = '#218838';
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayBooks();
        });
        paginationContainer.appendChild(pageButton);
    }
}

