let quotesEl = document.querySelector('#quotes');

function createCoverEl(cover) {
	return `
		<div class="image">
			<img src="${cover.url}" width="${150}" height="${cover.height}"/>
		</div>
	`;
}

function createQuoteEl(quote) {
	console.log(quote);

	return `
		<div class="quote">
			<div class="quote__body">
				${ quote.cover ? createCover(quote.cover) : '' }
				<div class="text">
					<div class="quote-text">${ quote.quote }</div>
					<div class="book-name">${ quote.author } «${ quote.book }»</div>
				</div>
			</div>
		</div>
	`;
}

(function(){

	function createQuote(object) {
		return {
			// author: object.document.authors,
			// book: object.document.title,
			// cover: object.document.cover,
			quote: object.content
		};
	}

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

						quotes.push(...objects.map(createQuote));
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
							let bookId = bookWrapper.objects[0].document_uuid;
							return loadBookQuotes(user, bookId);
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

	// nastenkavoronina
	// vashukov

	// console.log(loadBookmateQuotes('nastenkavoronina'));
	/*loadBookmateQuotes('vashukov').then(quotes => {
		console.log(quotes);
	});*/

	document.addEventListener('DOMContentLoaded', function() {
		var userNameEl = document.getElementById('user-name');
		var searchEl = document.getElementById('search');
		var quotesEl = document.getElementById('quotes');

		searchEl.addEventListener('click', function() {
				// console.log(userNameEl.value);

			loadBookmateQuotes(userNameEl.value).then(quotes => {

				quotesEl.innerHTML = quotes.map(createQuoteEl).join('');

			});
		});
	});

})();
