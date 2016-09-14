(function(){

	function loadBookQuotes(user, bookId) {
		let quotes = [];

		return new Promise((resolve, reject) => {
			(function load(page) {
				let url = `https://bookmate.com/a/4/u/${user}/d/${bookId}/m.json?p=${page}&pp=10`;

				fetch(url)
					.then(response => response.json())
					.then(objects => {
						// Все цитаты загружены, сервер возвращает пустой массив
						if (objects.length === 0) {
							resolve(quotes);
							return;
						}

						quotes.push(...objects.map(object => object.content));
						load(page + 1);
					});
			})(1);
		});
	}

	function loadBookmateQuotes(user) {
		let quotes = [];

		return new Promise((resolve, reject) => {
			(function load(page) {
				let url = `https://bookmate.com/a/4/u/${user}/m/grouped.json?p=${page}&pp=10`;

				fetch(url)
					.then(response => response.json())
					.then(data => {
						// Все книги загружены, сервер возвращает пустой массив
						if (data.length === 0) {
							resolve(quotes);
							return;
						}

						let bookPromises = data.map(bookWrapper => {
							let book = bookWrapper.objects[0];
							let bookId = book.document_uuid;

							return loadBookQuotes(user, bookId).then(function(quotes) {
								return quotes.map(quote => ({
									quote,
									bookId,
									bookTitle: book.document.title,
									author: book.document.authors,
									cover: book.document.cover
								}));
							});
						});

						Promise.all(bookPromises).then(books => {
							books.forEach(bookQuotes => {
								quotes.push(...bookQuotes);
							});
							load(page + 1);
						});
					});
			})(1);
		});
	}

	window.loadBookmateQuotes = loadBookmateQuotes;

})();