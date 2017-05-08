'use strict';

describe('swissChessDirectives: scSetup', function() {
  var injector;
  var element;
  var scope;
  beforeEach(function() {
    injector = angular.injector(['ng','swissChess',"views/setup.html"]);

    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<sc-setup></sc-setup>')(scope);
      scope.$apply();
    });
  });

  it('should have three fields', function() {
    let inputs = element.find('input');
    expect(inputs.length).toEqual(3);
    expect(inputs[0].id).toEqual('title');
    expect(inputs[1].id).toEqual('numPlayers');
    expect(inputs[2].id).toEqual('numRounds');
  });

  it('should have a go button', function() {
    let buttons = element.find('button');
    expect(buttons.length).toEqual(1);
    expect(buttons[0].innerHTML).toEqual('Get Started');
    expect(buttons[0].getAttribute("ng-click")).toEqual("runSetup()");
    buttons[0].click();    
  });


});