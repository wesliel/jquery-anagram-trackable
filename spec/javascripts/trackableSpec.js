
describe("A document", function() {
	var $fixtures, $fixtureForm, valObj, testOptions;

	beforeEach(function() {
		loadFixtures('trackable.html');
		$fixtureForm = $('#fixture');

		// Mock Google Analystics object to spy on
		ga = function() {};
		spyOn(window, 'ga');
	});

	it("should track mouseover event, with category", function() {
		$('#track-mouseover').trigger('mouseover');

		expect(window.ga).toHaveBeenCalledWith();
	});


	it("should track mouseout and click event, with category, label, and numeric value", function() {
		$('#track-mouseout').trigger('mouseout');
		
		expect(window.ga).toHaveBeenCalledWith();

		$('#track-mouseout').trigger('click');
		expect(window.ga).toHaveBeenCalledWith();
	});

	it("should track click event, with category, nonInteraction, and no value", function() {
		$('#track-click-no-hit-no-value').trigger('click');
		
		expect(window.ga).toHaveBeenCalledWith();
	});

	it("should track click event, with category and a page-hit", function() {
		$('#track-click-hit').trigger('click');
		
		expect(window.ga).toHaveBeenCalledWith();
	});

	it("should track JavaScript error thrown", function() {
		var x = 9, sum = x + y;

		expect(window.ga).toHaveBeenCalledWith();
	});
});