webpackJsonp([0],[,function(e,a,r){"use strict";r(7),r(6),r(5),r(4),angular.module("swissChess").component("swissChess",{template:r(14),controller:"swissChessCtrl"})},function(e,a){},,function(e,a,r){"use strict";function n(e,a,r){function n(e){return"Competition "+e.title+" ("+e.numRounds+" rounds : "+e.numPlayers+" players) Saved on "+e.savedOn}e.saved=!1,e.showAbout=!1,e.toggleAbout=function(){e.showAbout=!e.showAbout},e.init=function(){r.init();var a=localStorage.getItem(i);if(a){var s=JSON.parse(a);e.saved=n(s)}},e.reset=function(){confirm(o)&&e.init()},e.deleteSave=function(){confirm(l)&&(localStorage.removeItem(i),e.saved=!1)},e.save=function(){if(!e.saved||!r.initialised||confirm(s)){var a=r.getSaveObj();localStorage.setItem(i,JSON.stringify(a)),e.saved=n(a)}},e.load=function(){if(!r.isInitialised||confirm(t)){var e=localStorage.getItem(i),a=JSON.parse(e);r.setFromSaveObj(a)}},e.getAllPlayers=function(){return a.getAllPlayers()},e.game=r,e.showTab=function(e){r.activeTab=e},e.init()}var s="Are you sure, this will overwrite your saved competition?\n\nPress ok to continue.",t="Are you sure, this will overwrite all details of your current competition?\n\nPress ok to continue.",l="Are you sure, this will delete your saved competition?\n\nPress ok to continue.",o="Are you sure, this will clear your current competition?\n\nPress ok to continue.",i="savedComp";n.$inject=["$scope","playersFactory","gameFactory"],angular.module("swissChess").controller("swissChessCtrl",n)},function(e,a,r){"use strict";angular.module("swissChess").directive("scTabs",function(){return{type:"E",template:r(15)}}),angular.module("swissChess").directive("scAbout",function(){return{type:"E",template:r(8)}}),angular.module("swissChess").directive("scMenu",function(){return{type:"E",template:r(9)}}),angular.module("swissChess").directive("scSetup",function(){return{type:"E",scope:{runSetup:"&setup",game:"="},template:r(13)}}),angular.module("swissChess").directive("scPlayerDetails",function(){return{type:"E",scope:{players:"=",playerOrder:"=",setupFirstRound:"&"},template:r(10)}}),angular.module("swissChess").directive("scRound",function(){return{type:"E",scope:{players:"=",round:"=",completeRound:"&",isCurrentRound:"@"},link:function(e,a,r){e.submit=function(){e.roundForm.$setPristine(),e.roundForm.$setUntouched(),e.completeRound()}},template:r(12)}}),angular.module("swissChess").directive("scResults",function(){return{type:"E",scope:{players:"=",finalOrder:"="},template:r(11)}})},function(e,a,r){"use strict";function n(e){function a(){r(),o.finalOrder=e.sortPlayers(Object.keys(e.getAllPlayers()),"countBack"),o.finalOrder=e.sortPlayers(o.finalOrder,"score"),o.currentRoundNumber=0}function r(){for(var a in o.rounds){var r=o.rounds[a];for(var n in r.games){var s=r.games[n],t=e.getPlayerById(s.player1),l=e.getPlayerById(s.player2);switch(s.result){case"Player 1 win":t.countBack+=l.score;break;case"Player 2 win":l.countBack+=t.score;break;case"bye":break;default:t.countBack+=l.score/2,l.countBack+=t.score/2}}}}function n(){var e=new Date,a=1==e.getMinutes().toString().length?"0"+e.getMinutes():e.getMinutes(),r=1==e.getHours().toString().length?"0"+e.getHours():e.getHours(),n=e.getHours()>=12?"pm":"am",s=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];return["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][e.getDay()]+" "+s[e.getMonth()]+" "+e.getDate()+" "+e.getFullYear()+" "+r+":"+a+n}var o={};return o.rounds={},o.playerOrder=[],o.init=function(){o.activeTab="",o.isInitialised=!1,o.numPlayers=null,o.numRounds=null,o.title=null,e.resetPlayers(),o.currentRoundNumber="0",o.rounds={},o.playerOrder=[],o.finalOrder=[]},o.getStarted=function(){o.isInitialised=!0,e.initPlayers(o.numPlayers),o.activeTab="players"},o.setupFirstRound=function(){o.playerOrder=Object.keys(e.getAllPlayers()),o.setupRound("1")},o.setupRound=function(a){o.currentRoundNumber=a,o.rounds[a]={roundNumber:a,games:{}};var r=o.rounds[o.currentRoundNumber];e.shufflePlayers(o.playerOrder);for(var n=o.playerOrder.length/2,s=0;s<n;s++)r.games[s+1]={gameNumber:s+1,player1:o.playerOrder[s],player2:o.playerOrder[o.playerOrder.length-s-1],result:s===o.playerOrder.length-s-1?"bye":""};o.activeTab=a},o.completeRound=function(){var r=o.rounds[o.currentRoundNumber];for(var n in r.games){var i=r.games[n],u=e.getPlayerById(i.player1),d=e.getPlayerById(i.player2);switch(i.result){case"Player 1 win":u.score+=s;break;case"Player 2 win":d.score+=s;break;case"bye":u.score+=t;break;default:u.score+=l,d.score+=l}}if(o.numRounds==o.currentRoundNumber)a(),o.activeTab="results";else{var c=parseInt(o.currentRoundNumber)+1;o.setupRound(c)}},o.getSaveObj=function(){var a={};return a.finalOrder=o.finalOrder,a.isInitialised=o.isInitialised,a.numPlayers=o.numPlayers,a.numRounds=o.numRounds,a.title=o.title,a.rounds=o.rounds,a.currentRoundNumber=o.currentRoundNumber,a.players=e.getAllPlayers(),a.activeTab=o.activeTab,a.playerOrder=o.playerOrder,a.savedOn=n(),a},o.setFromSaveObj=function(a){o.finalOrder=a.finalOrder,o.isInitialised=a.isInitialised,o.numPlayers=a.numPlayers,o.numRounds=a.numRounds,o.title=a.title,o.rounds=a.rounds,o.currentRoundNumber=a.currentRoundNumber,e.setAllPlayers(a.players),o.activeTab=a.activeTab,o.playerOrder=a.playerOrder},o}var s=3,t=3,l=1;n.$inject=["playersFactory"],angular.module("swissChess").factory("gameFactory",n)},function(e,a,r){"use strict";angular.module("swissChess").factory("playersFactory",[function(){var e={},a={};return a.sortPlayers=function(a,r){return a.sort(function(a,n){return e[n][r]-e[a][r]})},a.shufflePlayers=function(e){var a=e.length%2?1:2;e.unshift(e[e.length-a]),e.splice(e.length-a,1)},a.initPlayers=function(a){for(var r=0;r<a;r++)e[r+1]={id:r+1,score:0,countBack:0}},a.resetPlayers=function(){e={}},a.setAllPlayers=function(a){e=Object.assign({},a)},a.getAllPlayers=function(){return e},a.getPlayerById=function(a){return e[a]},a}])},function(e,a){e.exports='<h2>About Comp Runner</h2> <p>Comp Runner is a simple app, designed to run on any modern browser, to help tournament organisers to keep track of scoring.</p> <p>Version 1 automatically organises players into rounds based on a simple round robin algorithm.</p> <p>Scoring is handled automatically, with 3 points for a win and 1 point for a draw. Countback is handled at the end of a comp by summing the scores of a person\'s beaten opponents.</p> <p>You can save a tournament locally to open again later.</p> <h4>Plans for future releases</h4> <ul> <li> Add a Swiss Chess pairing option </li> <li> Add the ability to have different scoring & countback methods </li> <li> Add the ability to record spot prizes </li> </ul> <p>Feedback is welcome.</p> <button ng-click=toggleAbout() class="btn btn-primary btn-block">Close</button>'},function(e,a){e.exports='<nav class="navbar navbar-default"> <div class=container-fluid> <div class=navbar-header> <button type=button class="navbar-toggle collapsed" data-toggle=collapse data-target=#bs-example-navbar-collapse-1 aria-expanded=false> <span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span> </button> <a class=navbar-brand href=#>Comp Runner</a> </div> <div class="navbar-collapse collapse" id=bs-example-navbar-collapse-1 aria-expanded=false style=height:1px> <ul class="nav navbar-nav navbar-right"> <li><a href=# ng-click=toggleAbout()>Help / About</a></li> <li class=dropdown> <a href=# class=dropdown-toggle data-toggle=dropdown role=button aria-expanded=false>Save / Load / Reset <span class=caret></span></a> <ul class=dropdown-menu role=menu> <li ng-if=saved class="dropdown-header dropdown-header-wrapped"><p>{{saved}}</p></li> <li class=divider></li> <li><a href=# ng-if=game.isInitialised ng-click=reset()>Reset</a></li> <li><a href=# ng-if=game.isInitialised ng-click=save()>Save</a></li> <li><a href=# ng-if=saved ng-click=load()>Load</a></li> <li><a href=# ng-if=saved ng-click=deleteSave()>Delete save</a></li> </ul> </li> </ul> </div> </div> </nav>'},function(e,a){e.exports="<div> <form name=playerDetails> <h2>Player details</h2> <div ng-if=\"playerOrder.length===0\"> <p>Enter a name for each player and the army they will be using.</p> <p>Once you have entered this information, click on the <strong>Create First Found</strong> button</p> </div> <div ng-repeat=\"player in players\" class=row> <div class=col-xs-12> <h4>Player {{player.id}} <small> {{player.score}} points ({{player.countBack}}) </small>  </h4></div> <div class=\"col-xs-12 col-md-6\"> <div class=form-group ng-class=\"playerDetails['playerName'+player.id].$touched && playerDetails['playerName'+player.id].$invalid ? 'has-error' : ''\"> <label for=playerName{{player.id}} class=hidden-xs>Name</label> <input class=form-control ng-model=player.name name=playerName{{player.id}} id=playerName{{player.id}} placeholder=Name required ng-pattern=/[a-zA-Z0-9]{3,}/ /> <span class=help-block ng-show=\"playerDetails['playerName'+player.id].$touched && playerDetails['playerName'+player.id].$invalid\">please enter a name</span> </div> </div> <div class=\"col-xs-12 col-md-6\"> <div class=form-group ng-class=\"playerDetails['playerArmy'+player.id].$touched && playerDetails['playerArmy'+player.id].$invalid ? 'has-error' : ''\"> <label for=playerArmy{{player.id}} class=hidden-xs>Army</label> <input class=form-control ng-model=player.army name=playerArmy{{player.id}} id=playerArmy{{player.id}} placeholder=Army required/> <span class=help-block ng-show=\"playerDetails['playerArmy'+player.id].$touched && playerDetails['playerArmy'+player.id].$invalid\">Please enter an army</span> </div> </div> </div> <button ng-click=setupFirstRound() class=\"btn btn-block\" ng-class=\"playerDetails.$invalid ? 'btn-disabled' : 'btn-primary'\" ng-disabled=playerDetails.$invalid ng-if=\"playerOrder.length===0\">Create First Round</button> </form> </div>"},function(e,a){e.exports='<table class="table table-striped"> <thead> <th class=col-xs-4> Name </th> <th class=col-xs-4> Army </th> <th class=col-xs-2> Score (Countback) </th> </thead> <tr ng-repeat="playerId in finalOrder"> <td class=col-xs-4> {{players[playerId].name}} </td> <td class=col-xs-4> {{players[playerId].army}} </td> <td class=col-xs-2> {{players[playerId].score}} ({{players[playerId].countBack}}) </td> </tr> </table> '},function(e,a){e.exports='<div> <form name=roundForm> <h2>Round {{round.roundNumber}}</h2> <div ng-repeat="game in round.games" class=form-group> <div ng-if="game.result != \'bye\'"> <label for=result{{game.gameNumber}}> Game {{game.gameNumber}} <small>{{players[game.player1].name}} ({{players[game.player1].army}}) vs {{players[game.player2].name}} ({{players[game.player2].army}})</small> </label> <select name=result{{game.gameNumber}} ng-if="isCurrentRound==\'true\'" id=result{{game.gameNumber}} ng-model=game.result required class=form-control> <option value="">---select result---</option> <option value="Player 1 win">{{players[game.player1].name}} win</option> <option value="Player 2 win">{{players[game.player2].name}} win</option> <option value=Draw>Draw</option> </select> <p ng-if="isCurrentRound!=\'true\'">{{game.result}}</p> </div> <div ng-if="game.result == \'bye\'"> <label>Bye for {{players[game.player2].name}}</label> </div> </div> <button ng-click=submit() ng-disabled=roundForm.$invalid ng-if="isCurrentRound==\'true\'" class="btn btn-block" ng-class="roundForm.$invalid ? \'btn-disabled\' : \'btn-primary\'">Complete round</button> </form> </div>'},function(e,a){e.exports='<form name=setupForm> <h2>Get Started</h2> <p>Enter a name for your competition, how many players and how many rounds you will be playing.</p> <p>Once you have entered this information, click on the <strong>Get Started</strong> button</p> <div class=form-group ng-class="setupForm.title.$touched && setupForm.title.$invalid ? \'has-error\' : \'\'"> <label for=title>Competition Name:</label> <input class=form-control ng-model=game.title id=title name=title type=text placeholder="Competition name" required/> <span class=help-block ng-show="setupForm.title.$touched && setupForm.title.$invalid">Please enter a title</span> </div> <div class=form-group ng-class="setupForm.numPlayers.$touched && setupForm.numPlayers.$invalid ? \'has-error\' : \'\'"> <label for=numPlayers>Number of players:</label> <input class=form-control ng-model=game.numPlayers id=numPlayers name=numPlayers type=number placeholder="Number of players" min=1 max=999 required/> <span class=help-block ng-show="setupForm.numPlayers.$touched && setupForm.numPlayers.$invalid">Please enter a number between 1 and 999</span> </div> <div class=form-group ng-class="setupForm.numRounds.$touched && setupForm.numRounds.$invalid ? \'has-error\' : \'\'"> <label for=numRounds>Number of rounds:</label> <input class=form-control ng-model=game.numRounds id=numRounds name=numRounds type=number placeholder="Number of rounds" min=1 max=999 required/> <span class=help-block ng-show="setupForm.numRounds.$touched && setupForm.numRounds.$invalid">Please enter a number between 1 and 999</span> </div> <div> <button ng-click=runSetup() ng-disabled=setupForm.$invalid class="btn btn-block" ng-class="setupForm.$invalid ? \'btn-disabled\' : \'btn-primary\'">Get Started</button> </div> </form> '},function(e,a){e.exports="<div class=container> <sc-menu></sc-menu> <sc-about ng-if=showAbout></sc-about> <div ng-if=!showAbout> <sc-setup ng-if=!game.isInitialised setup=game.getStarted() game=game></sc-setup> <div ng-if=game.isInitialised> <h1>{{game.title}}<br/><small>{{game.numPlayers}} Players : {{game.numRounds}} Rounds</small></h1> <sc-tabs></sc-tabs> <sc-player-details ng-if=\"game.activeTab=='players'\" players=getAllPlayers() player-order=game.playerOrder setup-first-round=game.setupFirstRound()></sc-player-details> <sc-round ng-if=\"game.activeTab!='players' && game.activeTab!='results' \" players=getAllPlayers() round=game.rounds[game.activeTab] complete-round=game.completeRound() is-current-round=\"{{game.activeTab == game.currentRoundNumber}}\"></sc-round> <sc-results ng-if=\"game.activeTab=='results'\" players=getAllPlayers() final-order=game.finalOrder></sc-results> </div> </div> </div>"},function(e,a){e.exports="<ul class=\"nav nav-tabs\"> <li role=presentation ng-class=\"game.activeTab=='players' ? 'active':''\"><a href=# ng-click=\"showTab('players')\">Players</a></li> <li role=presentation ng-repeat=\"round in game.rounds\" ng-class=\"game.activeTab==round.roundNumber ? 'active':''\"><a href=# ng-click=showTab(round.roundNumber)>Round {{round.roundNumber}}</a></li> <li role=presentation ng-if=\"game.finalOrder.length > 0\" ng-class=\"game.activeTab=='results' ? 'active':''\"><a href=# ng-click=\"showTab('results')\">Results</a></li> </ul>"},function(e,a,r){"use strict";r(2),angular.module("swissChess",[]),r(1)}],[16]);
//# sourceMappingURL=app.bundle.js.map