// BOOK CLASS
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn
    };
}

// UI CLASS
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        for (let book of books) {
            UI.addBookToList(book)
        };
    }

    static addBookToList(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    };

    static showAlert(message, classMessage) {
        const div = document.createElement("div");
        div.className = `alert alert-${classMessage}`;
        div.textContent = message;

        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        // Vanish 3 sec
        setTimeout(() => {
            document.querySelector(".alert").remove();
        }, 2000)
    }

    static clearFields() {
        if (confirm("Do You Want to Add this Book ?")) {
            document.querySelector("#title").value = "";
            document.querySelector("#author").value = "";
            document.querySelector("#isbn").value = "";
        }
    }

    static deleteBook(el) {
        if (el.classList.contains("delete")) {
            console.log("Book Deleted");
            el.parentElement.parentElement.remove();
        }
    }
}

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem("books"))
        };
        return books;

    };

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem("books", JSON.stringify(books));
    };

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem("books", JSON.stringify(books));
    }
};

// EVENT DISPLAY BOOKS
document.addEventListener("DOMContentLoaded", UI.displayBooks);

// EVENT: ADD BOOKS
document.querySelector("#book-form").addEventListener("submit", e => {
    e.preventDefault();

    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validation
    if (title === "" || author === "" || isbn === "") {
        UI.showAlert("Information Uncompleted! Please Fill in All Informations!", "warning");
    } else {
        // Instantiate Book
        const book = new Book(title, author, isbn);
        console.log(book);
        
        // Add book to UI
        UI.addBookToList(book);

        // Add book to the store
        Store.addBook(book);

        // Success Added Book
        UI.showAlert("Book Added Successfuly!", "success");
    
        // Clear fields
        UI.clearFields();
    }
});

// EVENT: REMOVE BOOKS
document.querySelector("#book-list").addEventListener("click", e => {
    UI.deleteBook(e.target);

    // Remove from UI
    UI.showAlert("Book Removed!", "danger");

    // Remove from the Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)
})