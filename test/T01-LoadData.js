var fs = require('fs');

function writeScreenShot(data, filename) {
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
}


describe('Data is loaded',function (){
    it('Should show a list of more than two books', function(){
        browser.get("http://localhost:8080");
        var books = element.all(by.repeater('book in books'));
        browser.driver.sleep(2000);
        
        
        browser.takeScreenshot().then(function (png) {
    			writeScreenShot(png, 'ng-test.png');
    	});
        expect(books.count()).toBeGreaterThan(2);
    });
})