'use strict';

describe('comp factory', function() {
  let playersFactory, compFactory;

  const saveObj = JSON.parse(`{
    "isInitialised":true,
    "numPlayers":4,
    "numRounds":4,
    "title":"test",
    "rounds":{
      "1":{"roundNumber":"1","games":{"1":{"gameNumber":1,"player1":"3","player2":"4","result":"Player 1 win"},"2":{"gameNumber":2,"player1":"1","player2":"2","result":"Player 1 win"}}},
      "2":{"roundNumber":2,"games":{"1":{"gameNumber":1,"player1":"2","player2":"4","result":""},"2":{"gameNumber":2,"player1":"3","player2":"1","result":""}}}},
    "currentRoundNumber":2,
    "players":{
      "1":{"id":1,"score":3,"countBack":0,"name":"aaaa","army":"a"},
      "2":{"id":2,"score":0,"countBack":0,"name":"bbbb","army":"b"},
      "3":{"id":3,"score":3,"countBack":0,"name":"cccc","army":"c"},
      "4":{"id":4,"score":0,"countBack":0,"name":"dddd","army":"d"}
    },
    "activeTab":2,
    "playerOrder":["2","3","1","4"],
    "savedOn":1494048622028}`
  );

  beforeEach(angular.mock.module('compRunner'));

  beforeEach(inject(function(_compFactory_,_playersFactory_) {
    compFactory = _compFactory_;
    playersFactory = _playersFactory_;

    spyOn(playersFactory, 'resetPlayers');
    spyOn(playersFactory, 'initPlayers');
    spyOn(playersFactory, 'setAllPlayers');
    spyOn(playersFactory, 'sortPlayers').and.callFake(function() {
      return [ '1', '2', '3', '4' ];
    });

    spyOn(playersFactory, 'getAllPlayers').and.callFake(function() {
      return { 
        1: { id:1, score: 4, countBack: 0 }, 
        2: { id:2, score: 2, countBack: 0 }, 
        3: { id:3, score: 1, countBack: 0 }, 
        4: { id:4, score: 3, countBack: 0 } 
      };
    });
    spyOn(playersFactory, 'getPlayerById').and.callFake(function() {
      return {'id':4,'score':0,'countBack':0,'name':'dddd','army':'d'};
    });
  }));

  it('should exist', function() {
    expect(compFactory).toBeDefined();
  });

  it('should initialise correctly', function() {    
    compFactory.init();
    expect(compFactory.activeTab).toEqual('');
    expect(compFactory.isInitialised).toEqual(false);
    expect(compFactory.numPlayers).toEqual(null);
    expect(compFactory.numRounds).toEqual(null);
    expect(compFactory.title).toEqual(null);
    expect(playersFactory.resetPlayers).toHaveBeenCalled();
    expect(compFactory.currentRoundNumber).toEqual('0');
    expect(compFactory.rounds).toEqual({});
    expect(compFactory.finalOrder).toEqual([]);
  });

  it('should getStarted correctly', function() {
    compFactory.numPlayers = 4;
    compFactory.getStarted();
    expect(compFactory.isInitialised).toEqual(true);
    expect(playersFactory.initPlayers).toHaveBeenCalledWith(4);
    expect(compFactory.activeTab).toEqual('players');
  });

  it('should setupFirstRound correctly', function() {
    spyOn(compFactory, 'setupRound');
    compFactory.setupFirstRound();
    expect(playersFactory.getAllPlayers).toHaveBeenCalled();
    expect(compFactory.setupRound).toHaveBeenCalledWith('1');
  });

  it('should setupRound correctly', function() {
    compFactory.setFromSaveObj(saveObj);
    compFactory.setupRound(3);
    const newRound = compFactory.rounds[3];
    expect(newRound.roundNumber).toEqual(3);
    expect(newRound.games['1'].player1).toEqual('1');
    expect(newRound.games['1'].player2).toEqual('4');
    expect(newRound.games['2'].player1).toEqual('2');
    expect(newRound.games['2'].player2).toEqual('3');    
    expect(newRound.games['3']).toEqual(undefined);
  });

  it('should completeRound correctly for middle round', function() {
    compFactory.setFromSaveObj(saveObj);
    compFactory.completeRound();
    const round = compFactory.rounds[3];
    expect(compFactory.currentRoundNumber).toEqual(3);
    expect(compFactory.activeTab).toEqual(3);
    expect(round.games['1'].player1).toEqual('3');
    expect(round.games['1'].player2).toEqual('4');
    expect(round.games['2'].player1).toEqual('1');
    expect(round.games['2'].player2).toEqual('2');
  });

  it('should completeRound correctly for last round', function() {
    const newSaveObj = Object.assign({}, saveObj, {numRounds:2});
    compFactory.setFromSaveObj(newSaveObj);
    compFactory.completeRound();

    expect(compFactory.currentRoundNumber).toEqual(0);
    expect(compFactory.activeTab).toEqual('results');
    expect(playersFactory.sortPlayers).toHaveBeenCalled();
  });


  it('should setFromSaveObj correctly', function() {
    compFactory.setFromSaveObj(saveObj);
    expect(compFactory.isInitialised).toEqual(true);
    expect(compFactory.numPlayers).toEqual(4);
    expect(compFactory.numRounds).toEqual(4);
    expect(compFactory.title).toEqual('test');
    expect(compFactory.rounds).toEqual(saveObj.rounds);
    expect(compFactory.currentRoundNumber).toEqual(2);
    expect(compFactory.activeTab).toEqual(2);
    expect(playersFactory.setAllPlayers).toHaveBeenCalled();
  });

  it('should getSaveObj correctly', function() {    
    compFactory.setFromSaveObj(saveObj);
    const newSaveObj = compFactory.getSaveObj();
    expect(newSaveObj.isInitialised).toEqual(compFactory.isInitialised);
    expect(newSaveObj.numPlayers).toEqual(compFactory.numPlayers);
    expect(newSaveObj.numRounds).toEqual(compFactory.numRounds);
    expect(newSaveObj.title).toEqual(compFactory.title);
    expect(newSaveObj.rounds).toEqual(compFactory.rounds);
    expect(newSaveObj.currentRoundNumber).toEqual(compFactory.currentRoundNumber);
    expect(newSaveObj.activeTab).toEqual(compFactory.activeTab);
    expect(playersFactory.getAllPlayers).toHaveBeenCalled();
  });
  
});
