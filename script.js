var players = [];
var playerStacks = [];
var gameEnded = false;
var currentPlayer = 0;
var firstTurn = true;
turnRolls = 0;
turnStartingStack = 0;
turnEndingStack = 0;
var spots = [false, false, false, false, false];
var allRolls = [];
var rounds = 1;
var setupProgression = 0;
var gamesInSeries = 1;
var currentGameScore = [0, 0];
var currentGamePenalties = [0, 0];
var seriesStatus = [0, 0];
var seriesGoals = [0, 0];
var seriesPenalties = [0, 0];
var seriesPegsRemoved = [0, 0];
var yellowCardStatus = [0, 0];
var foulCommittedBy = 0;
var oppositePlayer = 0;
var pegs = [10, 10];
var numOfPlayers = 2;
var turnSummary = true;
var showSuccessRate = true;
var showInstructions = false;



const modalSetup = document.getElementById('modal-setup');
const modalInstructions = document.getElementById('modal-instructions');
const modalWin = document.getElementById('modal-win');
const modalSettings = document.getElementById('modal-settings');
const modalFoul = document.getElementById('modal-foul');
const modalCoin = document.getElementById('modal-coin');
const modalTurnSummary = document.getElementById('modal-turn-summary');

// Open Game Setup modal on page load
modalSetup.classList.add("open");
// players = ["John", "Frank"]
// document.getElementById("scoreboardPlayerNames").innerText = `${players[0]} vs ${players[1]}`;

function openModal(modal, fromFoulType) {
  // Note: fixed elements will also need the margin adjustment (like a fixed header, if you have one).
  var scrollBarWidth = window.innerWidth - document.body.offsetWidth;
  document.body.style.margin = '0px ' + scrollBarWidth + 'px 0px 0px';
  document.body.style.overflow = 'hidden';
  // modal.style.display = 'block';
  modal.classList.add("open");
  if (fromFoulType) {
    document.getElementById('instructionsTypesOfFouls').scrollIntoView({
      behavior: 'smooth', // Smooth scrolling
      block: 'start' // Align to the top of the modal content
    });
  }
};

function closeModal(modal) {
  document.body.style.margin = '';
  document.body.style.overflow = '';
  // modal.style.display = 'none';
  modal.classList.remove("open");
};

function showSettingsModal() {
  document.getElementById("settings-adjust-player0-name").innerText = `Adjust ${players[0]}`;
  document.getElementById("settings-player0-score").innerText = currentGameScore[0];
  document.getElementById("settings-player0-yellow-cards").innerText = yellowCardStatus[0];
  document.getElementById("settings-player0-pegs").innerText = pegs[0];
  document.getElementById("settings-player0-games").innerText = seriesStatus[0];
  document.getElementById("settings-adjust-player1-name").innerText = `Adjust ${players[1]}`;
  document.getElementById("settings-player1-score").innerText = currentGameScore[1];
  document.getElementById("settings-player1-yellow-cards").innerText = yellowCardStatus[1];
  document.getElementById("settings-player1-pegs").innerText = pegs[1];
  document.getElementById("settings-player1-games").innerText = seriesStatus[1];
  // Only show yellow cards adjustment if the players have yellow cards to decrease
  if (yellowCardStatus[0] == 0) {
    document.getElementById("settings-player0-yellow-cards-container").style.display = "none";
  } else if (yellowCardStatus[0] > 0) {
    document.getElementById("settings-player0-yellow-cards-container").style.display = "block";
  }
  if (yellowCardStatus[1] == 0) {
    document.getElementById("settings-player1-yellow-cards-container").style.display = "none";
  } else if (yellowCardStatus[1] > 0) {
    document.getElementById("settings-player1-yellow-cards-container").style.display = "block";
  }
  // Hide yellow cards plus buttons (becuase they should do that via the main foul button)
  document.getElementById("settings-player0-yellow-cards-plus-button").style.visibility = "hidden";
  document.getElementById("settings-player1-yellow-cards-plus-button").style.visibility = "hidden";

  // Hide score plus button if score is 6 (becuase they should do that via the main goal button) and hide score minus button if score is 0
  if (currentGameScore[0] == 6) {
    document.getElementById("settings-player0-score-plus-button").style.visibility = "hidden";
  } else if (currentGameScore[0] < 6) {
    document.getElementById("settings-player0-score-plus-button").style.visibility = "visible";
  }
  if (currentGameScore[0] == 0) {
    document.getElementById("settings-player0-score-minus-button").style.visibility = "hidden";
  } else {
    document.getElementById("settings-player0-score-minus-button").style.visibility = "visible";
  }

  if (currentGameScore[1] == 6) {
    document.getElementById("settings-player1-score-plus-button").style.visibility = "hidden";
  } else if (currentGameScore[1] < 6) {
    document.getElementById("settings-player1-score-plus-button").style.visibility = "visible";
  }
  if (currentGameScore[1] == 0) {
    document.getElementById("settings-player1-score-minus-button").style.visibility = "hidden";
  } else {
    document.getElementById("settings-player1-score-minus-button").style.visibility = "visible";
  }

  // Hide pegs plus button if pegs is 10 (becuase that is the max) and hide pegs minus button if pegs is 0
  if (pegs[0] == 10) {
    document.getElementById("settings-player0-pegs-plus-button").style.visibility = "hidden";
  } else if (pegs[0] < 10) {
    document.getElementById("settings-player0-pegs-plus-button").style.visibility = "visible";
  }
  if (pegs[0] == 0) {
    document.getElementById("settings-player0-pegs-minus-button").style.visibility = "hidden";
  } else {
    document.getElementById("settings-player0-pegs-minus-button").style.visibility = "visible";
  }

  if (pegs[1] == 10) {
    document.getElementById("settings-player1-pegs-plus-button").style.visibility = "hidden";
  } else if (pegs[1] < 10) {
    document.getElementById("settings-player1-pegs-plus-button").style.visibility = "visible";
  }
  if (pegs[1] == 0) {
    document.getElementById("settings-player1-pegs-minus-button").style.visibility = "hidden";
  } else {
    document.getElementById("settings-player1-pegs-minus-button").style.visibility = "visible";
  }


  // Only show games adjustment if the this is more than a 1 game series
  if (gamesInSeries == 1) {
    document.getElementById("settings-player0-games-container").style.display = "none";
    document.getElementById("settings-player1-games-container").style.display = "none";
    document.getElementById('settingsNewGameButton').innerText = "NEW SERIES";

  } else {
    document.getElementById("settings-player0-games-container").style.display = "block";
    document.getElementById("settings-player1-games-container").style.display = "block";
    document.getElementById("settingsRematchButton").innerHTML = '<span>RESTART GAME</span>\n<ion-icon name="refresh-outline" class="ion-rematch"></ion-icon>';
    document.getElementById('settingsNewGameButton').innerText = "END SERIES";

    if (seriesStatus[0] == Math.floor(gamesInSeries / 2)) {
      document.getElementById("settings-player0-games-plus-button").style.visibility = "hidden";
    } else if (seriesStatus[0] < Math.floor(gamesInSeries / 2)) {
      document.getElementById("settings-player0-games-plus-button").style.visibility = "visible";
    }
    if (seriesStatus[0] == 0) {
      document.getElementById("settings-player0-games-minus-button").style.visibility = "hidden";
    } else {
      document.getElementById("settings-player0-games-minus-button").style.visibility = "visible";
    }
    if (seriesStatus[1] == Math.floor(gamesInSeries / 2)) {
      document.getElementById("settings-player1-games-plus-button").style.visibility = "hidden";
    } else if (seriesStatus[1] < Math.floor(gamesInSeries / 2)) {
      document.getElementById("settings-player1-games-plus-button").style.visibility = "visible";
    }
    if (seriesStatus[1] == 0) {
      document.getElementById("settings-player1-games-minus-button").style.visibility = "hidden";
    } else {
      document.getElementById("settings-player1-games-minus-button").style.visibility = "visible";
    }
  }

  // modalSettings.classList.add("open")
  openModal(modalSettings, false);
}

function settingsIncrease(playerNumber, adjustmentType) {
  let elementId1 = `settings-player${playerNumber}-${adjustmentType}`;
  let elementId2 = `settings-player${playerNumber}-${adjustmentType}-plus-button`;
  let elementId3 = `settings-player${playerNumber}-${adjustmentType}-minus-button`;
  let adjustmentValue = 0;
  let maxValue = 0;
  switch (adjustmentType) {
    case "score":
      currentGameScore[playerNumber] += 1;
      adjustmentValue = currentGameScore[playerNumber];
      maxValue = 6;
      let elementIdScore = `player${playerNumber}Score`;
      document.getElementById(elementIdScore).innerText = adjustmentValue;
      break;
    case "yellow-cards":
      yellowCardStatus[playerNumber] += 1;
      adjustmentValue = yellowCardStatus[playerNumber];
      maxValue = 1;
      break;
    case "pegs":
      pegs[playerNumber] += 1;
      adjustmentValue = pegs[playerNumber];
      maxValue = 10;
      document.getElementById("pegs").innerText = `${pegs[0]} on ${pegs[1]}`;
    case "games":
      seriesStatus[playerNumber] += 1;
      adjustmentValue = seriesStatus[playerNumber];
      maxValue = Math.floor(gamesInSeries / 2);
      document.getElementById("series").innerText = `${seriesStatus[0]} - ${seriesStatus[1]}`;
      break;
    default:
      console.log("Unknown adjustment");
  }
  document.getElementById(elementId1).innerText = adjustmentValue;
  if (adjustmentValue == maxValue) {
    document.getElementById(elementId2).style.visibility = "hidden";
  }
  if (adjustmentValue == 1) {
    document.getElementById(elementId3).style.visibility = "visible";
  }
}

document.getElementById('settings-player0-score-plus-button').addEventListener('click', () => settingsIncrease(0, "score"));
document.getElementById('settings-player1-score-plus-button').addEventListener('click', () => settingsIncrease(1, "score"));
document.getElementById('settings-player0-yellow-cards-plus-button').addEventListener('click', () => settingsIncrease(0, "yellow-cards"));
document.getElementById('settings-player1-yellow-cards-plus-button').addEventListener('click', () => settingsIncrease(1, "yellow-cards"));
document.getElementById('settings-player0-pegs-plus-button').addEventListener('click', () => settingsIncrease(0, "pegs"));
document.getElementById('settings-player1-pegs-plus-button').addEventListener('click', () => settingsIncrease(1, "pegs"));
document.getElementById('settings-player0-games-plus-button').addEventListener('click', () => settingsIncrease(0, "games"));
document.getElementById('settings-player1-games-plus-button').addEventListener('click', () => settingsIncrease(1, "games"));

function settingsDecrease(playerNumber, adjustmentType) {
  let elementId1 = `settings-player${playerNumber}-${adjustmentType}`;
  let elementId2 = `settings-player${playerNumber}-${adjustmentType}-plus-button`;
  let elementId3 = `settings-player${playerNumber}-${adjustmentType}-minus-button`;
  let adjustmentValue = 0;
  let underMaxValue = 0;
  switch (adjustmentType) {
    case "score":
      currentGameScore[playerNumber] -= 1;
      adjustmentValue = currentGameScore[playerNumber];
      underMaxValue = 5;
      var elementIdScore = `player${playerNumber}Score`;
      document.getElementById(elementIdScore).innerText = adjustmentValue;
      break;
    case "yellow-cards":
      yellowCardStatus[playerNumber] -= 1;
      adjustmentValue = yellowCardStatus[playerNumber];
      underMaxValue = 1;
      var elementYellow = `player${playerNumber}YellowCardStatus`;
      document.getElementById(elementYellow).style.visibility = "hidden";
      break;
    case "pegs":
      pegs[playerNumber] -= 1;
      adjustmentValue = pegs[playerNumber];
      underMaxValue = 9;
      document.getElementById("pegs").innerText = `${pegs[0]} on ${pegs[1]}`;
      break;
    case "games":
      seriesStatus[playerNumber] -= 1;
      adjustmentValue = seriesStatus[playerNumber];
      underMaxValue = Math.floor(gamesInSeries / 2) - 1;
      document.getElementById("series").innerText = `${seriesStatus[0]} - ${seriesStatus[1]}`;
      break;
    default:
      console.log("Unknown adjustment");
  }
  document.getElementById(elementId1).innerText = adjustmentValue;
  if (adjustmentValue == 0) {
    document.getElementById(elementId3).style.visibility = "hidden";
  }
  if (adjustmentValue == underMaxValue) {
    document.getElementById(elementId2).style.visibility = "visible";
  }
}

document.getElementById('settings-player0-score-minus-button').addEventListener('click', () => settingsDecrease(0, "score"));
document.getElementById('settings-player1-score-minus-button').addEventListener('click', () => settingsDecrease(1, "score"));
document.getElementById('settings-player0-yellow-cards-minus-button').addEventListener('click', () => settingsDecrease(0, "yellow-cards"));
document.getElementById('settings-player1-yellow-cards-minus-button').addEventListener('click', () => settingsDecrease(1, "yellow-cards"));
document.getElementById('settings-player0-pegs-minus-button').addEventListener('click', () => settingsDecrease(0, "pegs"));
document.getElementById('settings-player1-pegs-minus-button').addEventListener('click', () => settingsDecrease(1, "pegs"));
document.getElementById('settings-player0-games-minus-button').addEventListener('click', () => settingsDecrease(0, "games"));
document.getElementById('settings-player1-games-minus-button').addEventListener('click', () => settingsDecrease(1, "games"));

document.getElementById('settings-button').addEventListener('click', () => showSettingsModal());
// document.getElementById('player0DecreaseScoreButton').addEventListener('click', () => settingsDecreaseScore(0));

document.getElementById('player0FoulButton').addEventListener('click', () => showFoulModal(0));
document.getElementById('player1FoulButton').addEventListener('click', () => showFoulModal(1));

document.getElementById('foul-close-button').addEventListener('click', () => closeFoulModal());

function showFoulModal(playerNumber) {
  document.getElementById("card-selector-container").style.display = "block";
  document.getElementById("coin-flip-container").style.display = "none";
  document.getElementById("foul-instructions").innerText = `What type of foul did ${players[playerNumber]} commit:`;
  currentGamePenalties[playerNumber] += 1;
  foulCommittedBy = playerNumber;
  if (foulCommittedBy == 0) {
    oppositePlayer = 1;
  } else {
    oppositePlayer = 0;
  }
  modalFoul.classList.add("open");
}

document.getElementById('foulYellowButton').addEventListener('click', () => yellowCardEarned(foulCommittedBy));

document.getElementById('foulRedButton').addEventListener('click', () => showCoin(foulCommittedBy, false));

function closeFoulModal() {
  modalFoul.classList.remove("open");
  setTimeout(function () {
    document.getElementById('coin').className = "";  // Remove any existing classes
    document.getElementById('coin').classList.add('quickHeads');
  }, 500);
}

function yellowCardEarned(playerNumber) {
  console.log(playerNumber)
  let elementId = `player${playerNumber}YellowCardStatus`;
  console.log(elementId)
  yellowCardStatus[playerNumber] += 1;

  if (yellowCardStatus[playerNumber] == 1) {
    document.getElementById(elementId).style.visibility = "visible";
    document.getElementById("card-selector-container").style.display = "none";
    document.getElementById("foul-instructions").innerHTML = `That is ${players[playerNumber]}'s first yellow&nbspcard.<br>${players[oppositePlayer]} gets a free flick from center field.`;
    console.log(yellowCardStatus)
  } else if (yellowCardStatus[playerNumber] == 2) {
    showCoin(playerNumber, true);
    console.log(yellowCardStatus)

  }
}


function showCoin(playerNumber, fromYellow) {
  console.log("entered coin screen");
  document.getElementById("card-selector-container").style.display = "none";
  document.getElementById("coin-result-container").style.display = "none";
  document.getElementById("coin-flip-container").style.display = "block";
  foulCommittedBy = playerNumber;
  if (fromYellow) {
    document.getElementById("foul-instructions").innerHTML = `That is ${players[playerNumber]}'s second yellow card, which results in a red card. ${players[playerNumber]} select red or yellow for the coin&nbsp;flip.`;
  } else {
    document.getElementById("foul-instructions").innerHTML = `${players[playerNumber]} select red or yellow for the coin&nbsp;flip.`;

  }
  document.getElementById("coinHeadsButton").style.display = "block";
  document.getElementById("coinTailsButton").style.display = "block";
  document.getElementById("coin").style.display = "block";
}

async function makeCoinSelection(headsOrTails) {
  if (headsOrTails == "heads") {
    var coinCalledColor = "red";
  } else if (headsOrTails == "tails") {
    var coinCalledColor = "yellow";
  }
  document.getElementById("coinHeadsButton").style.display = "none";
  document.getElementById("coinTailsButton").style.display = "none";

  console.log(`${headsOrTails} was selected`);
  document.getElementById("foul-instructions").innerText = `${players[foulCommittedBy]} selected ${coinCalledColor}.`;

  let coinResult = await coinFlip();
  if (coinResult == "heads") {
    var coinResultColor = "red";
  } else if (coinResult == "tails") {
    var coinResultColor = "yellow";
  }
  if (coinResult == headsOrTails) {
    document.getElementById("coin-result").innerHTML = `It's ${coinResultColor}. ${players[foulCommittedBy]} won the toss and gets to pick which peg to remove from their own&nbsp;side.<br><br>Then ${players[oppositePlayer]} gets a free flick from anywhere behind the midfield&nbsp;line.`;
  } else {
    document.getElementById("coin-result").innerHTML = `It's ${coinResultColor}. ${players[foulCommittedBy]} lost the toss so ${players[oppositePlayer]} gets to pick which peg of to remove from ${players[foulCommittedBy]}'s;&nbsp;side.<br><br>Then ${players[oppositePlayer]} gets a free flick from anywhere behind the midfield&nbsp;line.`;
  }
  document.getElementById('foul-close-button').style.display = "block";
  document.getElementById('coin-result-container').style.display = "block";
  // keep track of pegs left
  pegs[foulCommittedBy] -= 1;
  document.getElementById('pegs').innerText = `${pegs[0]} on ${pegs[1]}`

  // Reset fouler's yellow card status
  yellowCardStatus[foulCommittedBy] = 0;
  let elementId = `player${foulCommittedBy}YellowCardStatus`;
  document.getElementById(elementId).style.visibility = "hidden";
}

document.getElementById('coinHeadsButton').addEventListener('click', () => makeCoinSelection("heads"));
document.getElementById('coinTailsButton').addEventListener('click', () => makeCoinSelection("tails"));



function gamesMinusButtonClicked() {
  if (gamesInSeries > 1) {
    gamesInSeries -= 2;
    if (gamesInSeries == 1) {
      document.getElementById("minus-button").style.visibility = "hidden";
    }
    if (gamesInSeries < 7) {
      document.getElementById("plus-button").style.visibility = "visible";
    }
  } else {
    gamesInSeries = 1;
  }
  document.getElementById("num-of-games").innerText = gamesInSeries;
};

document.getElementById('minus-button').addEventListener('click', () => gamesMinusButtonClicked());


function gamesPlusButtonClick() {
  if (gamesInSeries < 7) {
    gamesInSeries += 2;
    if (gamesInSeries == 7) {
      document.getElementById("plus-button").style.visibility = "hidden";
    }
    document.getElementById("num-of-games").innerText = gamesInSeries;
    if (gamesInSeries > 1) {
      document.getElementById("minus-button").style.visibility = "visible";
    }
  }
};

document.getElementById("plus-button").addEventListener('click', () => gamesPlusButtonClick());

function instructionButtonClicked() {
  showInstructions = !showInstructions;
  if (showInstructions) {
    document.getElementById("instructionBody").style.display = "block";
    document.getElementById("instructionSpacer").style.display = "block";
    document.getElementById('instructionButton').innerHTML = '<span>How to Play</span>\n<ion-icon name="caret-up-circle-outline" class="ion-expand"></ion-icon>';
  } else {
    document.getElementById("instructionBody").style.display = "none";
    document.getElementById("instructionSpacer").style.display = "none";
    document.getElementById('instructionButton').innerHTML = '<span>How to Play</span>\n<ion-icon name="caret-down-circle-outline" class="ion-expand"></ion-icon>';

  }
}

// document.getElementById('instructionButton').addEventListener('click', () => instructionButtonClicked());
document.getElementById('instructionButton').addEventListener('click', () => openModal(modalInstructions, false));
document.getElementById('foulTypesOfFouls').addEventListener('click', () => openModal(modalInstructions, true));
document.getElementById('settingsRulesButton').addEventListener('click', () => openModal(modalInstructions, false));




// document.getElementById('instructionButton').addEventListener('click', () => {
//   document.querySelector("body").style.overflow = "hidden";
//   modalInstructions.classList.add("open");
// });



function firstNextButtonClicked() {
  setupProgression = 1;
  document.getElementById('setupPrompt').style.display = "none";
  document.getElementById('firstNextButton').style.display = "none";
  document.getElementById('instructionButtonWrapper').style.display = "none";
  document.getElementById('setupError').style.display = "block";
  document.getElementById('setupButtonWrapper').style.display = "grid";
  document.getElementById('playerNames').style.display = "block";
  document.getElementById('player0').style.display = "block";
  document.getElementById('player0').focus();
}

document.getElementById('firstNextButton').addEventListener('click', () => firstNextButtonClicked());

function backButtonClicked() {
  if (setupProgression == 1) {
    document.getElementById('playerNames').style.display = "none";
    document.getElementById('player0').style.display = "none";
    document.getElementById('setupButtonWrapper').style.display = "none";
    document.getElementById('setupError').style.visibility = "hidden";
    document.getElementById('setupError').style.display = "none";
    document.getElementById('setupPrompt').style.display = "block";
    document.getElementById('firstNextButton').style.display = "flex";
    document.getElementById('instructionButtonWrapper').style.display = "block";
  } else {
    document.getElementById('setupError').style.visibility = "hidden";
    document.getElementById('player' + (setupProgression - 1)).style.display = "none";
    document.getElementById('player' + (setupProgression - 2)).style.display = "block";
    document.getElementById('player' + (setupProgression - 2)).focus();
    if (setupProgression == numOfPlayers) {
      document.getElementById('playButton').style.display = "none";
      document.getElementById('nextButton').style.display = "flex";
    }
  }
  setupProgression -= 1;
}

document.getElementById('backButton').addEventListener('click', () => backButtonClicked());

function nextButtonClicked() {
  if (document.getElementById('player' + (setupProgression - 1)).value == "") {
    document.getElementById('setupError').style.visibility = "visible";
    document.getElementById('player' + (setupProgression - 1)).focus();
    return false;
  } else {
    document.getElementById('setupError').style.visibility = "hidden";
    document.getElementById('player' + (setupProgression - 1)).style.display = "none";
    setupProgression += 1;
    document.getElementById('player' + (setupProgression - 1)).style.display = "block";
    document.getElementById('player' + (setupProgression - 1)).focus();
    if (setupProgression == numOfPlayers) {
      document.getElementById('nextButton').style.display = "none";
      document.getElementById('playButton').style.display = "flex";
    }
  }
}

document.getElementById('nextButton').addEventListener('click', () => nextButtonClicked());

function setupGame() {
  if (document.getElementById('player' + (setupProgression - 1)).value == "") {
    document.getElementById('setupError').style.visibility = "visible";
    document.getElementById('player' + (setupProgression - 1)).focus();
    return false;
  } else {
    for (var l = 0; l < 2; l++) {
      players.push(document.getElementById('player' + l).value)
    }
    console.log(players);

    players = players.filter(element => {
      return element !== '';
    });

    document.getElementById("scoreboardPlayerNames").innerText = `${players[0]} vs ${players[1]}`;
    document.getElementById("series").innerHTML = `${seriesStatus[0]} - ${seriesStatus[1]}`;
    document.getElementById("series-title").innerHTML = `Series (Best of ${gamesInSeries}):`;
    document.getElementById("player0Name").innerText = players[0];
    document.getElementById("player1Name").innerText = players[1];

    if (gamesInSeries == 1) {
      document.getElementById("series-wrapper").style.display = "none";
    }


    // Checks if media query for less than 601px wide is true
    if (window.matchMedia('(max-width: 600px)').matches) {
      var stackElements = document.getElementsByClassName('player-stack');
      var nameElements = document.getElementsByClassName('player-name');
      switch (numOfPlayers) {
        case 3:
          Array.from(nameElements).forEach(element => element.classList.add("small-name-font"));
          break;
        case 4:
          Array.from(nameElements).forEach(element => element.classList.add("tiny-name-font"));
          break;
        case 5:
          Array.from(stackElements).forEach(element => element.classList.add("small-stack-font"));
          Array.from(nameElements).forEach(element => element.classList.add("micro-name-font"));
          break;
        default:
          console.log("didn't need to adjust font");
      }
    }
    modalSetup.classList.remove("open");
    document.querySelector("body").style.overflow = "auto";
    playGame();
  }
}

document.getElementById('playButton').addEventListener('click', () => setupGame());

function afterScoring(playerNumber) {
  console.log("score is:");
  console.log(currentGameScore[0]);
  console.log(currentGameScore[1]);
  if (currentGameScore[playerNumber] == 7) {
    displayWinner(playerNumber)
  }
}


async function goalButtonPressed(playerNumber) {
  document.getElementById('player0GoalButton').style.pointerEvents = 'none';
  document.getElementById('player1GoalButton').style.pointerEvents = 'none';
  document.getElementById('player0GoalButton').style.background = 'rgba(23, 80, 43, 0.5)';
  document.getElementById('player1GoalButton').style.background = 'rgba(23, 80, 43, 0.5)';
  let elementId = `player${playerNumber}Score`;
  console.log(elementId)

  currentGameScore[playerNumber] += 1;
  document.getElementById(elementId).innerText = currentGameScore[playerNumber];

  console.log("wait to score again")
  afterScoring(playerNumber);
  console.log("immediately afterScoring function");
  setTimeout(function () {
    console.log("inside of timeout");
    document.getElementById('player0GoalButton').style.pointerEvents = 'auto';
    document.getElementById('player1GoalButton').style.pointerEvents = 'auto';
    document.getElementById('player0GoalButton').style.background = '#17502B';
    document.getElementById('player1GoalButton').style.background = '#17502B';
    console.log("ready to score again")
  }, 500);
}

function playGame() {
  document.getElementById('game-wrapper').style.display = "block"
}

function restartCurrentGame() {
  currentGameScore = [0, 0]
  yellowCardStatus = [0, 0]
  pegs = [10, 10]
  currentGamePenalties = [0, 0]
  gameEnded = false;
  document.getElementById('player0GoalButton').style.visibility = "visible";
  document.getElementById('player0GoalButton').style.display = "flex";
  document.getElementById('player1GoalButton').style.visibility = "visible";
  document.getElementById('player1GoalButton').style.display = "flex";
  document.getElementById('player0FoulButton').style.visibility = "visible";
  document.getElementById('player0FoulButton').style.display = "flex";
  document.getElementById('player1FoulButton').style.visibility = "visible";
  document.getElementById('player1FoulButton').style.display = "flex";
  // document.getElementById('showWinButton').style.display = "none";
  document.getElementById('player0Score').innerText = currentGameScore[0];
  document.getElementById('player1Score').innerText = currentGameScore[1];
  document.getElementById('pegs').innerText = `${pegs[0]} on ${pegs[1]}`;
  document.getElementById('player0YellowCardStatus').style.visibility = "hidden";
  document.getElementById('player1YellowCardStatus').style.visibility = "hidden";

  playGame();
}

document.getElementById('player0GoalButton').addEventListener('click', () => goalButtonPressed(0));

document.getElementById('player1GoalButton').addEventListener('click', () => goalButtonPressed(1));


function settingsResume() {
  document.getElementById('player0Score').innerText = currentGameScore[0];
  document.getElementById('player1Score').innerText = currentGameScore[1];
  document.getElementById('series').innerText = `${seriesStatus[0]} - ${seriesStatus[1]}`;
  document.getElementById('pegs').innerText = `${pegs[0]} on ${pegs[1]}`;
  modalSettings.classList.remove("open")
}

document.getElementById('settingsResumeButton').addEventListener('click', () => settingsResume());

document.getElementById('settingsRematchButton').addEventListener('click', () => {
  restartCurrentGame();
  modalSettings.classList.remove("open");
});

document.getElementById('settingsNewGameButton').addEventListener('click', () => location.reload());

function turnSummaryCheckboxClicked() {
  if (turnSummary) {
    turnSummary = false;
    document.getElementById('turnSummaryCheckbox').innerHTML = "";
  } else {
    turnSummary = true;
    document.getElementById('turnSummaryCheckbox').innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>';
  }
}

// document.getElementById('turnSummaryCheckbox').addEventListener('click', () => turnSummaryCheckboxClicked());

function successRateCheckboxClicked() {
  showSuccessRate = !showSuccessRate;
  document.getElementById('successRateCheckbox').innerHTML = (showSuccessRate ? '<ion-icon name="checkmark-outline"></ion-icon>' : "");
  const successPercent = Math.round(((5 - spots.filter(Boolean).length) / 5 * 100));
  document.getElementById('successRate').innerHTML = (showSuccessRate ? `Chance of success: ${successPercent}%` : "&nbsp;");
  toggleSuccessClass(successPercent);
}

// document.getElementById('successRateCheckbox').addEventListener('click', () => successRateCheckboxClicked());

document.getElementById('rematchButton').addEventListener('click', () => {
  restartCurrentGame();
  modalWin.classList.remove("open");
});

// document.getElementById('win-close-button').addEventListener('click', () => modalWin.classList.remove("open"));

document.getElementById('instruction-close-button').addEventListener('click', () => closeModal(modalInstructions));
document.getElementById('instruction-bottom-close-button').addEventListener('click', () => closeModal(modalInstructions));

// document.getElementById('turn-close-button').addEventListener('click', () => modalTurnSummary.classList.remove("open"));

document.getElementById('newGameButton').addEventListener('click', () => location.reload());

// document.getElementById('showWinButton').addEventListener('click', () => modalWin.classList.add("open"));

// Display winner modal
function displayWinner(winner) {
  document.getElementById('player0GoalButton').style.display = "none";
  document.getElementById('player1GoalButton').style.display = "none";
  document.getElementById('player0FoulButton').style.display = "none";
  document.getElementById('player1FoulButton').style.display = "none";
  // document.getElementById('showWinButton').style.display = "block";
  // Setup Game Stats
  document.getElementById("winner").innerText = players[winner];
  document.getElementById("win1-goals-name").innerText = players[0];
  document.getElementById("win2-goals-name").innerText = players[1];
  document.getElementById("win1-goals-num").innerText = currentGameScore[0];
  document.getElementById("win2-goals-num").innerText = currentGameScore[1];
  document.getElementById("win1-penalties-name").innerText = players[0];
  document.getElementById("win2-penalties-name").innerText = players[1];
  document.getElementById("win1-penalties-num").innerText = currentGamePenalties[0];
  document.getElementById("win2-penalties-num").innerText = currentGamePenalties[1];
  document.getElementById("win1-pegs-name").innerText = players[0];
  document.getElementById("win2-pegs-name").innerText = players[1];
  let currentGamePegsRemoved = [];
  currentGamePegsRemoved[0] = 10 - pegs[0];
  currentGamePegsRemoved[1] = 10 - pegs[1];
  document.getElementById("win1-pegs-num").innerText = currentGamePegsRemoved[0];
  document.getElementById("win2-pegs-num").innerText = currentGamePegsRemoved[1];
  let outputText = "";

  if (gamesInSeries == 1) {
    // If 1 Game Series
    outputText = "is the winner!";
    document.getElementById('winner-series-wrapper').style.display = "none";
    document.getElementById('win-series-stats').style.display = "none";
    document.getElementById('rematchButton').innerHTML = '<span>REMATCH</span>\n<ion-icon name="refresh-outline" class="ion-rematch"></ion-icon>';
    document.getElementById('rematchButton').style.display = "flex";
    document.getElementById('newGameButton').innerText = "NEW SERIES";

  } else {
    if (winner == 0) {
      loser = 1;
    } else {
      loser = 0;
    }
    seriesStatus[winner] += 1
    document.getElementById('winner-series-wrapper').style.display = "block";
    // Don't show series stats on first game (since they would be the same as the game stats)
    if (seriesStatus[0] + seriesStatus[1] == 1) {
      document.getElementById('win-series-stats').style.display = "none";
    } else {
      document.getElementById('win-series-stats').style.display = "block";
    }
    document.getElementById('series').innerText = `${seriesStatus[0]} - ${seriesStatus[1]}`;
    document.getElementById('winner-series-status').innerText = `${seriesStatus[0]} - ${seriesStatus[1]}`;
    outputText = `is the winner of Game ${seriesStatus[0] + seriesStatus[1]} and `;
    // Setup Series Stats
    seriesGoals[0] += currentGameScore[0];
    seriesGoals[1] += currentGameScore[1];
    seriesPenalties[0] += currentGamePenalties[0];
    seriesPenalties[1] += currentGamePenalties[1];
    seriesPegsRemoved[0] += currentGamePegsRemoved[0];
    seriesPegsRemoved[1] += currentGamePegsRemoved[1];
    document.getElementById("win1-series-goals-name").innerText = players[0];
    document.getElementById("win2-series-goals-name").innerText = players[1];
    document.getElementById("win1-series-goals-num").innerText = seriesGoals[0];
    document.getElementById("win2-series-goals-num").innerText = seriesGoals[1];
    document.getElementById("win1-series-penalties-name").innerText = players[0];
    document.getElementById("win2-series-penalties-name").innerText = players[1];
    document.getElementById("win1-series-penalties-num").innerText = seriesPenalties[0];
    document.getElementById("win2-series-penalties-num").innerText = seriesPenalties[1];
    document.getElementById("win1-series-pegs-name").innerText = players[0];
    document.getElementById("win2-series-pegs-name").innerText = players[1];
    document.getElementById("win1-series-pegs-num").innerText = seriesPegsRemoved[0];
    document.getElementById("win2-series-pegs-num").innerText = seriesPegsRemoved[1];

    if (seriesStatus[winner] == (Math.floor(gamesInSeries / 2) + 1)) {
      // Series is over
      outputText += `has won the series!`;
      document.getElementById('rematchButton').style.display = "none";
      document.getElementById('newGameButton').innerText = "NEW SERIES";

    } else {
      document.getElementById('rematchButton').innerHTML = '<span>NEXT GAME</span>\n<ion-icon name="arrow-forward-outline" class="ion-arrows"></ion-icon >';
      document.getElementById('rematchButton').style.display = "flex";
      document.getElementById('newGameButton').innerText = "END SERIES";

      if (seriesStatus[winner] > seriesStatus[loser]) {
        // Leading series
        outputText += `leads the series.`;
      } else if (seriesStatus[winner] == seriesStatus[loser]) {
        // Tied series
        outputText += `has tied the series.`;
      } else {
        // Trailing series
        outputText += `trails in the series.`;
      }

    }
  }
  document.getElementById("winner-subtext").innerText = outputText

  // console.log("all rolls: " + allRolls);
  // document.getElementById("winRounds").innerText = `Rounds: ${rounds}`
  // for (x = 1; x < 7; x++) {
  //   console.log(allRolls.length);
  //   console.log(allRolls.filter((v) => (v === x)).length);
  //   console.log((allRolls.filter((v) => (v === x)).length) / allRolls.length);
  //   document.getElementById("win" + x).innerText = `${Math.round((allRolls.filter((v) => (v === x)).length / allRolls.length) * 100)}%`
  // }
  modalWin.classList.add("open");
}

function coinFlip() {
  return new Promise((resolve) => {
    var flipResult = Math.random();
    document.getElementById('coin').className = "";

    if (flipResult <= 0.5) {
      document.getElementById('coin').classList.add('heads');
      console.log('it is head');
      var coinResult = "heads";
    }
    else {
      document.getElementById('coin').classList.add('tails');
      console.log('it is tails');
      var coinResult = "tails";
    }

    setTimeout(function () {
      resolve(coinResult)
    }, 2000);
  });
}