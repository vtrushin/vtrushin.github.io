let page = 1;
let perPage = 10;


let quotesEl = document.querySelector('#quotes');

function createCover(cover) {
	return `
		<div class="image">
			<img src="${cover.url}" width="${150}" height="${cover.height}"/>
		</div>
	`;
}

function createQuote(quote) {
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

(function load() {
	let url = `https://bookmate.com/a/4/u/vashukov/m/grouped.json?p=${page}&pp=${perPage}`;

	fetch(url)
		.then(response => response.json())
		.then(data => {
			if (data.length === 0) return;
			let quotes = [];

			data.forEach(book => {
				book.objects.forEach(object => {
					quotes.push({
						author: object.document.authors,
						book: object.document.title,
						cover: object.document.cover,
						quote: object.content
					});
				});
			});

			quotesEl.innerHTML += quotes.map(createQuote).join('');

			page ++;
			load();
		});
})();

// function