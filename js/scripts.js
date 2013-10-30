$(function() {
  var game;
  var diceNames = {1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six'};
  
  $('.play').click(function() {    
    startGame();
  });

  $('button#roll-dice').click(function() {
    game.turn.rollDice();
    displayDice(game.turn);
    $(this).hide();
    $('#start-turn-instructions').hide();
    $("#reroll-dice").show();
    $("#reroll-instructions").fadeIn();
    $("#score-dice-instructions").fadeIn();
    $("#score-dice").show();
    $('#end-turn').show();
    $('#player-message').empty().append('select dice to reroll.');
  });

  $('button#reroll-dice').click(function() {
    var diceToReroll = getSelectedDice();
    game.turn.rerollDice(diceToReroll);
    displayDice(turn);
  });

  $('button#score-dice').click(function() {
    scoreTurn();
  });

  $('button#end-turn').click(function() {
    if (confirmTurnEnd()) {
      scoreTurn();   
      if (turn.score > 0) {
        updateScore();
      } else {
        alert("No points for you this round. Better luck next turn!");
      }
      endTurn();
    }
  });

  function confirmTurnEnd() {
    var confirmation = true;
    if (game.turn.numberOfRolls < 3) {
      confirmation = confirm('You still can still reroll the dice. Are you sure you want to end your turn?');
    }

    if (confirmation && getSelectedDice().length === 0) {
      confirmation = confirm('You have not selected any dice. Are you sure you want to continue with ending your turn?');
    }

    return confirmation;
  }

  $('.die').click(function() {
    $(this).toggleClass('selected');
  });

  function displayGame(game) {
    $('span#current-player-number').empty().append(game.currentPlayer.id);
    $('#game').fadeIn();
  }

  function displayDice(turn) {
    turn.dice.forEach(function(die, index) {
      $('span#die' + index).removeClass().addClass('die ' + diceNames[die.value]).attr('value', index);
    });
    $("#rerolls-remaining").empty().append(3 - turn.numberOfRolls);
    if (turn.numberOfRolls === 2) {
      $("#reroll-plural").empty();
    } else if (turn.numberOfRolls === 3) {
      $("#reroll-dice").hide();
      $("#reroll-plural").empty().append("s");
    } else {
      $("#reroll-plural").empty().append("s");
    }
  }

  function displayPlayedCombinations() {
    $('#display-played-combinations').children('.content').first().append("<div class='dice'></div>");
    game.playedCombinations[game.playedCombinations.length - 1].dice.forEach(function(dieValue) {
      $('#display-played-combinations').children('.content').first().children('.dice').last().append("<span class='die " + diceNames[dieValue] + "'></span>");
    });
  }

  function displayScore(players) {
    $('table#scores tbody').empty();
    players.forEach(function(player) {
      $('table#scores tbody').append("<tr>" + 
                                                       "<td>" +
                                                         "Player" + 
                                                         "<span class='insert-player-id'>" + player.id + "</span>" +
                                                       "</td>" + 
                                                       "<td>" +
                                                         "<span class='insert-player-score'>" + 
                                                           player.score +
                                                         "</span>" +
                                                       "</td>" +
                                                     "</tr>");
    });
  }

  function startGame() {
    $('.play').hide();
    game = Object.create(Game);
    var numberOfPlayers = prompt('How many players?');
    game.createPlayers(numberOfPlayers);
    game.initialize();
    displayScore(game.players);
    displayGame(game);
    $('html, body').animate({scrollTop: $('#game').offset().top}, 2000);
  }

  function getSelectedDice() {
    var selectedDice = [];
    $('.selected').each(function() {
      var dieIndex = $(this).attr('value');
      selectedDice.push(game.turn.dice[dieIndex]);
    });
    return selectedDice;
  }

  function scoreTurn() {
    var selectedDice = getSelectedDice();
    if (game.combinationHasBeenPlayed(selectedDice)) {
      alert('That combination has already been played this game. Please select a different combination.');
    } else if (selectedDice.length === 0) {
      alert('Please select at least one die.');
    } else {
      game.turn.score(selectedDice);
      alert('That combination is worth ' + game.turn.score + ' points.');
    }
  }

  function endTurn() {
    game.turnsCompleted ++;
    $("#reroll-instructions").hide();
    $("#reroll-dice").hide();
    if (game.isOver()) {
      endGame();
    } else {
      game.nextPlayer();
      $('span#current-player-number').empty().append(game.currentPlayer.id);
      $('#current-turn').empty().append(Math.floor(game.turnsCompleted/game.players.length + 1));
      $('button#roll-dice').show();
      for (var i = 0; i < 5; i++) {
        $('span#die' + i).removeClass().addClass('die void');
      }
    }
  }

  function endGame() {
    var winners = game.getWinners();
    console.log(winners);
    if (winners.length > 1) {
      $('#winner-info').empty().append("It's a tie!").fadeIn();
    } else {
      $('#winner-info').empty().append("Player " + winners[0].id + " won!").fadeIn();
    }
    $('.play').empty().append('Play Again').show();
    $('.board').hide();
  }


  function updateScore() {
    game.currentPlayer.addPoints(turn.score);
    game.addPlayedCombination(turn.playedCombination);
    displayPlayedCombinations();
    alert("You scored: " + turn.score);
    displayScore(game.players);
  }
});


















