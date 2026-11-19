
const API_URL = "/books";

const bookForm = document.getElementById("bookForm");
const bookList = document.getElementById("bookList");
const message = document.getElementById("message");

const bookId = document.getElementById("bookId");
const title = document.getElementById("title");
const author = document.getElementById("author");
const price = document.getElementById("price");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

let currentBooks = [];

// Display messages
function showMessage(text, type) {
    message.textContent = text;
    message.className = type;
}

// Fetch all books
async function getBooks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Unable to retrieve books");
        }

        const books = await response.json();
        currentBooks = books;
        displayBooks(books);

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Display books dynamically
function displayBooks(books) {
    bookList.innerHTML = "";

    if (books.length === 0) {
        bookList.innerHTML = "<p>No books available.</p>";
        return;
    }

    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "book-card";

        const heading = document.createElement("h3");
        heading.textContent = book.title;

        const idText = document.createElement("p");
        idText.textContent = `Book ID: ${book.id}`;

        const authorText = document.createElement("p");
        authorText.textContent = `Author: ${book.author}`;

        const priceText = document.createElement("p");
        priceText.textContent = `Price: ₹${book.price}`;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editBook(book.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteBook(book.id));

        card.append(heading, idText, authorText, priceText,
            editButton, deleteButton);

        bookList.appendChild(card);
    });
}

// Add or update a book
bookForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = bookId.value;

    const bookData = {
        title: title.value.trim(),
        author: author.value.trim(),
        price: Number(price.value)
    };

    if (!bookData.title || !bookData.author ||
        !Number.isFinite(bookData.price) || bookData.price <= 0) {
        showMessage("Please enter valid book details.", "error");
        return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bookData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Operation failed");
        }

        showMessage(data.message, "success");
        resetForm();
        await getBooks();

    } catch (error) {
        showMessage(error.message, "error");
    }
});

// Load book details into form for editing
function editBook(id) {
    const book = currentBooks.find(b => b.id === id);

    if (!book) return;

    bookId.value = book.id;
    title.value = book.title;
    author.value = book.author;
    price.value = book.price;

    formTitle.textContent = "Update Book";
    submitBtn.textContent = "Update Book";
    cancelBtn.hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Delete book
async function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Delete failed");
        }

        showMessage(data.message, "success");
        await getBooks();

    } catch (error) {
        showMessage(error.message, "error");
    }
}

// Search book using ID
document.getElementById("searchBtn").addEventListener("click", async () => {
    const id = document.getElementById("searchId").value.trim();

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        showMessage("Please enter a valid Book ID.", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Book not found");
        }

        displayBooks([data]);
        showMessage("Book found successfully.", "success");

    } catch (error) {
        bookList.innerHTML = "";
        showMessage(error.message, "error");
    }
});

// Show all books
document.getElementById("showAllBtn").addEventListener("click", () => {
    document.getElementById("searchId").value = "";
    showMessage("", "");
    getBooks();
});

// Reset form
function resetForm() {
    bookForm.reset();
    bookId.value = "";

    formTitle.textContent = "Add New Book";
    submitBtn.textContent = "Add Book";
    cancelBtn.hidden = true;
}

// Cancel editing
cancelBtn.addEventListener("click", resetForm);

// Load books when page opens
getBooks();
