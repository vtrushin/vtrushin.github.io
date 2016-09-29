function declensionOfNumber(number, titles) {
	return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
}

function createDefaultOptions(size) {
	let quoteText = declensionOfNumber(size, ['цитата', 'цитаты', 'цитат']);
	return `
		<option value="">Все ${size} ${quoteText}</option>
		<option disabled="disabled">———</option>
	`;
}

function createOption(book) {
	return `
		<option value="${book.id}">${book.title}</option>
	`;
}

document.addEventListener('DOMContentLoaded', function() {
	var userNameEl = document.getElementById('user-name');
	var booksEl = document.getElementById('books');
	var formEl = document.getElementById('form');
	var outputEl = document.getElementById('output');
	var loadingEl = document.getElementById('loading');

	outputEl.addEventListener('focus', function() {
		outputEl.select();
	});

	formEl.addEventListener('submit', function(e) {
		e.preventDefault();

		loadingEl.classList.remove('g-hidden');
		booksEl.classList.add('g-hidden');

		getQuotes(userNameEl.value).then(function(quotes) {
			// console.log(quotes);

			/*function groupBy(array, prop) {
				return array.reduce((grouped, item) => {
					let key = item[prop];
					if (!grouped[key]) {
						grouped[key] = [];
					}
					grouped[key].push(item);
					return grouped;
				}, {});
			}

			console.log(Object.keys(
				groupBy(quotes, 'bookId')
			));*/

			loadingEl.classList.add('g-hidden');
			booksEl.classList.remove('g-hidden');
			booksEl.focus();

			function showFilteredQuotes(bookId) {
				let values = (
					bookId
						? quotes.filter(quote => quote.book.id === bookId)
						: quotes
				).map(quote => quote.quote);

				outputEl.value = JSON.stringify(values, null, '\t');
			}

			var books = [];

			quotes.forEach(quote => {
				if (!books.find(book => book.id === quote.book.id)) {
					books.push({
						id: quote.book.id,
						title: quote.book.title
					})
				}
			});

			booksEl.innerHTML = [
				...createDefaultOptions(quotes.length),
				books.map(createOption)
			].join('');

			booksEl.addEventListener('change', () => {
				let selected = booksEl.selectedOptions[0];
				showFilteredQuotes(selected.value);
			});

			showFilteredQuotes('');
		});
	});
});