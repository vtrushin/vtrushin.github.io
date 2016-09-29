(function(){

	function loadBooksDict(user) {
		console.time('Books dict load');
		let dict = {};

		return new Promise((resolve, reject) => {
			(function load(pageNumber) {
				let url = `https://bookmate.com/a/4/u/${user}/m/grouped.json?p=${pageNumber}&pp=10`;

				fetch(url)
					.then(response => response.json())
					.then(data => {
						// Все книги загружены, сервер возвращает пустой массив
						if (data.length === 0) {
							console.timeEnd('Books dict load');
							resolve(dict);
							return;
						}

						data.forEach(bookCover => {
							let book = bookCover.objects[0];
							dict[book.document.uuid] = {
								title: book.document.title,
								authors: book.document.authors,
								cover: book.document.cover
							};
						});

						load(pageNumber + 1);
					});
			})(1);
		});
	}


	function loadQuotes(user) {
		console.time('Quotes load');
		let quotes = [];

		return new Promise((resolve, reject) => {
			(function load(pageNumber) {
				let url = `https://bookmate.com/a/4/u/${user}/m.json?p=${pageNumber}&pp=500`;

				fetch(url)
					.then(response => response.json())
					.then(objects => {
						// Все цитаты загружены, сервер возвращает пустой массив
						if (objects.length === 0) {
							console.timeEnd('Quotes load');
							resolve(quotes);
							return;
						}
						quotes.push(
							...objects.map(
								object => ({
									text: object.content,
									bookId: object.document_uuid
								})
							));
						load(pageNumber + 1);
					});
			})(1);
		});
	}

	function getQuotes(user) {
		console.time('Full quotes load');
		return new Promise((resolve, reject) => {
			Promise.all([loadBooksDict(user), loadQuotes(user)]).then(response => {
				let [dict, quotes] = response;
				console.timeEnd('Full quotes load');
				resolve(
					quotes.map(
						quote => ({
							quote: quote.text,
							book: Object.assign({}, dict[quote.bookId], {
								id: quote.bookId
							})
						})
					)
				);
			});
		});
	}

	window.getQuotes = getQuotes;

})();