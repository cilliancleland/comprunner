'use strict';

describe('compRunnerDirectives: scSetup', function() {
  let injector;
  let element;
  let scope;
  beforeEach(function() {
    injector = angular.injector(['ng','compRunner',"app/views/setup.html"]);

    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<sc-setup></sc-setup>')(scope);
      scope.$apply();
    });
  });

  it('should have three fields', function() {
    const inputs = element.find('input');
    expect(inputs.length).toEqual(3);
    expect(inputs[0].id).toEqual('title');
    expect(inputs[1].id).toEqual('numPlayers');
    expect(inputs[2].id).toEqual('numRounds');
  });

  it('should have a go button', function() {
    const buttons = element.find('button');
    expect(buttons.length).toEqual(1);
    expect(buttons[0].innerHTML).toEqual('Get Started');
    expect(buttons[0].getAttribute("ng-click")).toEqual("runSetup()");
    buttons[0].click();    
  });


});