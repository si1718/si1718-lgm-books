describe('Add book', function () {
	it('should add a new book', function (){
		browser.get('http://localhost:8080');

		element.all(by.repeater('book in books')).then(function (initialBooks){
				browser.driver.sleep(2000);
	
				element(by.model('newBook.author')).sendKeys('Prueba');
				element(by.model('newBook.title')).sendKeys('Titulo Prueba');
				element(by.model('newBook.publisher')).sendKeys('Editorial Prueba');
				element(by.model('newBook.year')).sendKeys('2017');
				element(by.model('newBook.idBooks')).sendKeys(Math.random());
				
				element(by.buttonText('Add')).click().then(function (){

					element.all(by.repeater('book in books')).then(function (books){
						expect(books.length).toEqual(initialBooks.length+1);
					});
				
				});
			
		});
	});
});