
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Sample book data
let books = [
    { id: 1, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", price: 250 },
    { id: 2, title: "The Alchemist", author: "Paulo Coelho", price: 300 },
    { id: 3, title: "Atomic Habits", author: "James Clear", price: 450 }
];

let nextId = 4;

// GET all books
app.get("/books", (req, res) => {
    res.json(books);
});

// GET book by ID
app.get("/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
});

// POST - Add new book
app.post("/books", (req, res) => {
    const { title, author, price } = req.body;

    if (!title || !author || price === undefined ||
        !Number.isFinite(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Please enter a valid title, author and price"
        });
    }

    const newBook = {
        id: nextId++,
        title: title.trim(),
        author: author.trim(),
        price: Number(price)
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// PUT - Update book
app.put("/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, price } = req.body;

    if (!title || !author || price === undefined ||
        !Number.isFinite(Number(price)) || Number(price) <= 0) {
        return res.status(400).json({
            message: "Please provide valid book details"
        });
    }

    book.title = title.trim();
    book.author = author.trim();
    book.price = Number(price);

    res.json({
        message: "Book updated successfully",
        book
    });
});

// DELETE - Remove book
app.delete("/books/:id", (req, res) => {
    const index = books.findIndex(
        b => b.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    books.splice(index, 1);

    res.json({ message: "Book deleted successfully" });
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
