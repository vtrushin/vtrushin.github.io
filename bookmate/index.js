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

document.addEventListener('DOMContentLoaded', function() {
	var userNameEl = document.getElementById('user-name');
	var searchEl = document.getElementById('search');
	var quotesEl = document.getElementById('quotes');

	searchEl.addEventListener('click', function() {
		loadBookmateQuotes(userNameEl.value).then(function(quotes) {
			quotesEl.innerHTML += quotes.map(createQuoteEl).join('');
		});
	});
});
