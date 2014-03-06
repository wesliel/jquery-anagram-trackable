
describe("A document", function() {
  var $fixtures, $fixtureForm, valObj, testOptions;

  beforeEach(function() {
    loadFixtures('trackable.html');
    $('#fixture').anagramTrackable();

    // Mock Google Analystics object to spy on
    ga = function() {};
    spyOn(window, 'ga');
  });

  it("should track mouseover event, with category", function() {
    $('#track-mouseover').trigger('mouseover');
    expect(window.ga).toHaveBeenCalledWith('send', 'event', 'category1', 'mouseover');
  });


  it("should track mouseout and click event, with category, label, and numeric value", function() {
    $('#track-mouseout-click').trigger('mouseout');
    expect(window.ga).toHaveBeenCalledWith('send', 'event', 'category2', 'mouseout', 'label1');

    window.ga.calls.reset();

    $('#track-mouseout-click').trigger('click');
    expect(window.ga).toHaveBeenCalledWith('send', 'event', 'category2', 'click', 'label1');

  });

  it("should track click event, with category, nonInteraction, and no value", function() {
    $('#track-click-no-hit-no-value').trigger('click');
    expect(window.ga).toHaveBeenCalledWith('send', 'event', 'category3', 'click', { nonInteraction : 1 });
  });

  it("should track click event, with category and a page-hit", function() {
    $('#track-click-hit').trigger('click');
    expect(window.ga).toHaveBeenCalledWith('send', 'event', 'category4', 'click', { page : '/my-page' });
  });

  it("should track JavaScript error thrown", function() {
    // This try/catch block is to work-around native JavaScript error stopping Jasmine from continuing
    try {
      var x = 9, sum = x + y;
    } catch(err) {
      window.onerror(err.message, window.location, 44);
    }

    expect(window.ga).toHaveBeenCalledWith('send', 'exception', { exDescription : 'http://localhost:9090/SpecRunner.html?catch=false:44:y is not defined' });
  });
});