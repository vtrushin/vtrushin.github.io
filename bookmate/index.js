function declensionOfNumber(number, titles) {
	return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];
}

function randomChannel() {
	return Math.round(255 * Math.random());
}

function randomColor(alpha = 1) {
	const red = randomChannel();
	const green = randomChannel();
	const blue = randomChannel();

	return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
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

document.addEventListener('DOMContentLoaded', () => {
	var userNameEl = document.getElementById('user-name');
	var booksEl = document.getElementById('books');
	var formEl = document.getElementById('form');
	var loadingEl = document.getElementById('loading');
	var quoteEl = document.getElementById('quote');
	var quoteTextEl = document.getElementById('quote-text');
	let filteredQuotes = [];

	function updateQuote() {
		quoteTextEl.textContent = filteredQuotes[Math.round(Math.random() * filteredQuotes.length - 1)];
		document.body.style.backgroundColor = randomColor(.1);
	}

	quoteEl.addEventListener('click', updateQuote);

	formEl.addEventListener('submit', e => {
		e.preventDefault();

		loadingEl.classList.remove('g-hidden');
		booksEl.classList.add('g-hidden');

		getQuotes(userNameEl.value).then(quotes => {
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
				filteredQuotes = (
					bookId
						? quotes.filter(quote => quote.book.id === bookId)
						: quotes
				).map(quote => quote.quote);

				updateQuote();
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