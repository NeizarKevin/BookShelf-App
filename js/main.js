const books = [];
const RENDER_BOOK = "render-book";
const SAVED_BOOKS = "save-book";
const STORAGE_KEY = "BOOKSHELF_APP";
const titleBooks = document.querySelector('#inputBookTitle');
const authorBooks = document.querySelector('#inputBookAuthor');
const yearBooks = document.querySelector('#inputBookYear');
const isCompleteBooks = document.querySelector('#inputBookIsComplete');

function is_storage_exist() {
    if (typeof (Storage) === undefined) {
        alert('Browser Anda tidak support local storage')
        return false;
    }
    return true;
}

function generate_id() {
    return +new Date();
}

function generate_book (id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    }
}

function find_book (book_id) {
    for (const book_item of books) {
        if (book_item.id === book_id) {
            return book_item;
        }
    }

    return null;
}

function find_to_index (book_id) {
    for (const index in books) {
        if (books[index].id === book_id) {
            return index;
        }
    }
    return -1;
}

function make_card_book (booksObject) {
    const {
        id,
        title,
        author,
        year,
        isComplete,
    } = booksObject;

const title_element = document.createElement("h3");
title_element.setAttribute("id", "title-books");
title_element.innerText = `${title}`;

const author_element = document.createElement("h4");
author_element.setAttribute("id", "atuhor-books");
author_element.innerText = `Penulis : ${author}`;

const year_element = document.createElement("h4");
year_element.setAttribute("id", "year-books");
year_element.innerText = `Tahun : ${year}`;

const container = document.createElement("div");
container.append(title_element, author_element, year_element);
container.setAttribute("id", `books-${id}`);
container.classList.add("container-books");

if (isComplete) {
    const btn_green = document.createElement("button");
    btn_green.innerHTML = '<p><i class="fa-solid fa-book-open"></i> Belum Selesai dibaca</p>';
    btn_green.classList.add("green");
    btn_green.addEventListener("click", function(){
        handler_incomplete_to_read(id);
        if (handler_complete_to_read !== false) {
            swal("Berhasil memindahkan buku " + title + "!", {
                icon: "success",
            });
        } else {
            swal("Gagal memindahkan buku!", {
                icon: "error",
            });
        }
    });

    const btn_red = document.createElement("button");
    btn_red.innerHTML = '<p><i class="fa-regular fa-trash-can"></i> Hapus Buku</p>';
    btn_red.classList.add("red");
    btn_red.addEventListener("click", function() {
        swal({
            title: "Apakah Anda yakin ingin menghapus buku " + title + "?",
            icon: "warning",
            buttons: ["Batal", "Ya"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("Buku " + title + " berhasil dihapus!", {
                    icon: "success",
                });
                handler_remove_book(id)
            } else {
                swal("Buku tidak jadi dihapus!");
            }
        });
    });
    container.append(btn_green, btn_red);
} else {
    const btn_finish = document.createElement("button");
    btn_finish.innerHTML = '<p><i class="fa-solid fa-book"></i> Selesai Dibaca</p>';
    btn_finish.classList.add("finish");
    btn_finish.addEventListener("click", function() {
        handler_complete_to_read(id);
        if (handler_complete_to_read !== false) {
            swal("Yeyy, Kamu telah selesai membaca buku "+ title + "!", {
                icon: "success",
            });
        } else {
            swal("Gagal Memindahkan buku!", {
                icon: "error",
            });
        } 
        
    });

    const btn_red = document.createElement("button");
    btn_red.innerHTML = '<p><i class="fa-regular fa-trash-can"></i> Hapus Buku</p>';
    btn_red.classList.add("red");
    btn_red.addEventListener("click", function() {
        swal({
            title: "Apakah Anda yakin ingin menghapus buku " + title + "?",
            icon: "warning",
            buttons: ["Batal", "Ya"],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                swal("Buku " + title + " berhasil dihapus!", {
                    icon: "success",
                });
                handler_remove_book(id)
            } else {
                swal("Buku tidak jadi dihapus!");
            }
        });
    });
    container.append(btn_finish, btn_red); 
    }
    return container;
}

function reset_form_data() {
    document.getElementById('inputBookTitle').value = '';
    document.getElementById('inputBookAuthor').value = '';
    document.getElementById('inputBookYear').value = '';
    document.getElementById('inputBookIsComplete').checked = false;
    return;
}

function add_book() {
    const addTitleBooks = titleBooks.value;
    const addAuthorBooks = authorBooks.value;
    const addYearBooks = parseInt(yearBooks.value);
    const addIsComplete = isCompleteBooks.checked;
    const generateId = generate_id();
    const booksObject = generate_book(
        generateId,
        addTitleBooks,
        addAuthorBooks,
        addYearBooks,
        addIsComplete,
    );
    reset_form_data();
    books.push(booksObject);
    document.dispatchEvent(new Event(RENDER_BOOK));
    save_data();
}

function handler_complete_to_read (book_id) {
    const book_target = find_book(book_id);
    if (book_target == null) return;

    book_target.isComplete = true;
    document.dispatchEvent(new Event(RENDER_BOOK));
    save_data();
}

function handler_incomplete_to_read (book_id) {
    const book_target = find_book(book_id);
    if (book_target == null) return;

    book_target.isComplete = false;
    document.dispatchEvent(new Event(RENDER_BOOK));
    save_data();
}

function handler_remove_book (book_id) {
    const book_target = find_to_index(book_id);
    if (book_target === -1) return;
    books.splice(book_target, 1);
    document.dispatchEvent(new Event(RENDER_BOOK));
    save_data();
}

function save_data() {
    if (is_storage_exist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_BOOKS))
    }
}

function load_data_from_storage() {
    const serialize_data = localStorage.getItem(STORAGE_KEY);
    let data_obj = JSON.parse(serialize_data);

    if (data_obj !== null) {
        for (const book of data_obj) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_BOOK));
}

function search_books() {
    let search = document.querySelector('#searchBookTitle').value;
    let returnSearch = document.getElementsByClassName('container-books');

    for (const book_item of returnSearch) {
        let title_book = book_item.innerText.toUpperCase();
        let search_book = title_book.search(search.toUpperCase());
        if (search_book != -1) {
            book_item.style.display = '';
        } else {
            book_item.style.display = 'none';
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const submitForm = document.querySelector('#inputBook');
    const searchForm = document.querySelector('#searchBook');
    submitForm.addEventListener("submit", (e) => {
        e.preventDefault();
        add_book();
        swal("Berhasil menambahkan buku!", {
			icon: "success",
		});
    });
    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        search_books();
    });
    if (is_storage_exist()) {
        load_data_from_storage();
    }
});

document.addEventListener(SAVED_BOOKS, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_BOOK, function() {
    const uncompletedBookList = document.querySelector(".uncompletedBookList");
    const listCompletedBooks = document.querySelector(".completedBookList");

    uncompletedBookList.innerHTML = "";
    listCompletedBooks.innerHTML = "";

    for (const book_item of books) {
        const bookElement = make_card_book(book_item);
        if (book_item.isComplete) {
            listCompletedBooks.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});