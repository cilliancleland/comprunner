'use strict';

describe('players factory', function() {
  let playersFactory;
  const initiatedPlayers = { 1: { id: 1, score: 0, countBack: 0 }, 2:{ id:
2, score: 0, countBack: 0 } };
  const playersWithScores = { 
    1: { id:1, score: 4, countBack: 0 }, 
    2: { id:2, score: 2, countBack: 0 }, 
    3: { id:3, score: 1, countBack: 0 }, 
    4: { id:4, score: 3, countBack: 0 } 
  };
  const playersWithScoresOdd = { 
    1: { id:1, score: 4, countBack: 0 }, 
    2: { id:2, score: 2, countBack: 0 }, 
    3: { id:3, score: 1, countBack: 0 }, 
    4: { id:4, score: 3, countBack: 0 }, 
    5: { id:5, score: 3, countBack: 0 } 
  };

  beforeEach(angular.mock.module('compRunner'));

  beforeEach(inject(function(_playersFactory_) {
      playersFactory = _playersFactory_;
  }));

  it('should exist', function() {
    expect(playersFactory).toBeDefined();
  });

  it('should get and set all players', function() {
    expect(playersFactory.getAllPlayers()).toEqual({});
    playersFactory.setAllPlayers(initiatedPlayers);
    expect(playersFactory.getAllPlayers()).toEqual(initiatedPlayers);    
  });
    
  it('should initialise players', function() {
    playersFactory.initPlayers(2);
    expect(playersFactory.getAllPlayers()).toEqual(initiatedPlayers);    
  });

  it('should reset players', function() {
    playersFactory.initPlayers(2);
    playersFactory.resetPlayers();
    expect(playersFactory.getAllPlayers()).toEqual({});    
  });

  it('should getPlayerById', function() {
    playersFactory.initPlayers(2);
    const player = playersFactory.getPlayerById(2);
    expect(player.id).toEqual(2);    
  });

  it('should sort players', function() {    
    playersFactory.setAllPlayers(playersWithScores);
    const currentOrder = Object.keys(playersFactory.getAllPlayers());
    const sorted = playersFactory.sortPlayers(currentOrder, 'score');
    expect(sorted).toEqual([ '1', '4', '2', '3' ]);    
  });

  it('should shuffle an even number of players', function() {    
    playersFactory.setAllPlayers(playersWithScores);
    const currentOrder = Object.keys(playersFactory.getAllPlayers());
    playersFactory.shufflePlayers(currentOrder);
    expect(currentOrder).toEqual(['3', '1', '2', '4']);    
  });

  it('should shuffle an odd number of players', function() {    
    playersFactory.setAllPlayers(playersWithScoresOdd);
    const currentOrder = Object.keys(playersFactory.getAllPlayers());
    playersFactory.shufflePlayers(currentOrder);
    expect(currentOrder).toEqual(['5', '1', '2', '3', '4']);     
  });
 
});
