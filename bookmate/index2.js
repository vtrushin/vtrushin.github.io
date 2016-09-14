let defaultOption = `
	<option value="">Все</option>
	<option disabled="disabled">———</option>
`;

function createOption(book) {
	return `
		<option value="${book.id}">${book.title}</option>
	`;
}

document.addEventListener('DOMContentLoaded', function() {
	var userNameEl = document.getElementById('user-name');
	var booksEl = document.getElementById('books');
	var searchEl = document.getElementById('search');
	var outputEl = document.getElementById('output');

	outputEl.addEventListener('focus', function() {
		outputEl.select();
	});

	searchEl.addEventListener('click', function() {
		loadBookmateQuotes(userNameEl.value).then(function(quotes) {

			booksEl.classList.remove('g-hidden');

			function showFilteredQuotes(bookId) {
				let values = (
					bookId
					? quotes.filter(quote => quote.bookId === bookId)
					: quotes
				).map(quote => quote.quote);

				outputEl.value = JSON.stringify(values, null, '\t');
			}

			var books = [];

			quotes.forEach(quote => {
				if (!books.find(book => book.id === quote.bookId)) {
					books.push({
						id: quote.bookId,
						title: quote.bookTitle
					})
				}
			});

			booksEl.innerHTML = [...defaultOption, books.map(createOption)].join('');

			booksEl.addEventListener('change', () => {
				let selected = booksEl.selectedOptions[0];
				showFilteredQuotes(selected.value);
			});

			showFilteredQuotes('');
		});
	});
});