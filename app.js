var count = function () {
	var count = localStorage.getItem('count');
	if (count == null) {
		count = 0;
	}
	count++;
	localStorage.setItem('count', count);
	return count;
}
var Book = function (id, author, title, year, pages) {
	this.id = id;
	this.author = author;
	this.title = title;
	this.year = year;
	this.pages = pages;
}

var BookStorage = function () {
	var _this = this;
	this.books = [];


	this.addBook = function (book) {
		book.id = count();
		this.books.push(book);
		saveBooks();
		
	}
	this.deleteBook = function (bookId) {
		for (var i = 0; i < this.books.length; i++) {
			var book = this.books[i];
			if (book.id === bookId) {
				this.books.splice(i, 1);
			}
		}
		saveBooks();
	};
	this.findBookById = function (bookId) {
		for (var i = 0; i < this.books.length; i++) {
			var book = this.books[i];
			if (book.id === bookId) {
				return book;
			}
		}
	};
	this.saveBook = function (book) {
		for (var i = 0; i < this.books.length; i++) {
			if (this.books[i].id === book.id) {
				this.books[i] = book;
			}
		}
		saveBooks();
	};

	//get books from a local storage
	this.loadBooks = function () {
		if (!window.localStorage) return;

		var str = localStorage.getItem('books');
		if (!str) return;

		if (localStorage.length != 0) { //if local storage not empty
			this.books = JSON.parse(str);
		}
	};
	//save books in local storage
	var saveBooks = function () {
		var str = JSON.stringify(_this.books);
		localStorage.setItem('books', str);
	};
}

var app = {
	booksStorage: new BookStorage(),
	bookForm: {
		$authorInput: $('#author'),
		$titleInput: $('#bookTitle'),
		$yearInput: $('#year'),
		$pagesInput: $('#pages'),
	},
	bookFormErrors: [],
	initialize: function () {
		this.booksStorage.loadBooks();
		this.bindFormEvents();
		this.dispayBooks();
		this.bindEvents();
	},
	bindFormEvents: function () {
		this.$formSave = $('#add');
		this.$formCancel = $('.cancel');
		this.$formCancel.on('click', this.resetForm.bind(this));
		this.$formSave.on('click', this.saveBook.bind(this));
		this.$formCancel.on('click', this.resetEditing.bind(this));
	},
	bindEvents: function () {
		this.$editBtns = $(".js-edit-btn");
		this.$editBtns.on('click', this.editBook.bind(this));
		this.$removeBtns = $(".js-remove-btn");
		this.$removeBtns.on('click', this.removeBook.bind(this));
	},
	dispayBooks: function () {
		var books = this.booksStorage.books;
		for (var i = 0; i < books.length; i++) {
			this.printBooks(books[i]);
		}
	},
	editBook: function (e) {
		var $btn = $(e.currentTarget);
		var $bookItem = $btn.closest(".js-book-item");
		var bookId = $bookItem.data("book-id");
		var bookToEdit = this.booksStorage.findBookById(bookId);

		this.fillForm(bookToEdit);
		this.currentBook = bookToEdit;
		this.$formSave.val("Save");
		this.$formCancel.show();
		
	},
	saveBook: function () {
		var isAddition = !this.currentBook;
		if (this.isBookFormValid()) {
			var book = new Book(this.counter++, this.bookForm.$authorInput.val(), this.bookForm.$titleInput.val(), this.bookForm.$yearInput.val(), this.bookForm.$pagesInput.val());

			if (isAddition) {
				this.booksStorage.addBook(book);
				this.printBooks(book);
			} else {
				book.id = this.currentBook.id;
				this.booksStorage.saveBook(book);
				var $bookCard = $('[data-book-id=' + this.currentBook.id + ']');
				$bookCard.replaceWith(this.printBooks(book));
				this.resetEditing();
			}
			//reset form and refresh list events
			this.resetForm();
			this.bindEvents();
		}
	},
	resetEditing: function () {
		this.$formSave.val("Add");
		this.currentBook = null;
	},
	removeBook: function (e) {
		var $btn = $(e.currentTarget);
		var $bookItem = $btn.closest(".js-book-item");
		var bookId = $bookItem.data("book-id");
		var books = this.books;
		//remove from books array
		this.booksStorage.deleteBook(bookId);
		//remove from DOM
		$bookItem.remove();
	},
	fillForm: function (book) {
		this.bookForm.$authorInput.val(book.author);
		this.bookForm.$titleInput.val(book.title);
		this.bookForm.$yearInput.val(book.year);
		this.bookForm.$pagesInput.val(book.pages);

	},
	resetForm: function () {
		this.book =
		this.bookForm.$authorInput.val('');
		this.bookForm.$titleInput.val('');
		this.bookForm.$yearInput.val('');
		this.bookForm.$pagesInput.val('');
		this.$formCancel.hide();
	},
	printBooks: function (book) {
		var htmlLayoutItem = '<tr data-book-id="' + book.id + '" class="js-book-item"><td>' + book.title + '</td><td>' + book.author + '</td><td>' + book.year + '</td><td>' + book.pages + '</td><td><button class="js-edit-btn"><i class="fa fa-pencil-square-o"></i>Edit</button><button class="js-remove-btn"><i class="fa fa-times"></i>Remove</button></td>';
		$('tbody').append(htmlLayoutItem);
	},
	isBookFormValid: function () {
		isValid = this.bookForm.$authorInput.val() && this.bookForm.$titleInput.val() && this.bookForm.$yearInput.val() && this.bookForm.$pagesInput.val()
		return !!isValid;
	}
}
$(function () {
	app.initialize();
});