import { data } from "./data.js";

const $buttonsGame = document.querySelector(".buttons-game");
const $gameWrapper = document.querySelector(".game-wrapper");
const $resultWrapper = document.querySelector(".result-wrapper");
const $userSelection = document.querySelector(".user-selection");
const $resultMessage = document.querySelector(".result-message");
const $resultMessageTitle = document.querySelector(".result-message-title");
const $resultMessageButton = document.querySelector(".result-message-button");
const $pcSelection = document.querySelector(".pc-selection");
const $userScore = document.querySelector(".user-score");
const $totalScore = document.querySelector(".total-score");
const $template = document.querySelector("#button-game-template").content;
const $fragment = document.createDocumentFragment();

const createIconButtonGame = (value) => {
  $template.querySelector("button").setAttribute("data-button", value.name);
  $template.querySelector("button").style.backgroundImage =
    "linear-gradient(hsl(" +
    value.color_light +
    "),hsl(" +
    value.color_dark +
    ")";
  $template.querySelector("img").src = value.img;
  $template.querySelector("img").alt = value.name;

  let $clone = document.importNode($template, true);
  $fragment.appendChild($clone);
};

// ** MODAL RULES ** //
const $modal = document.querySelector(".modal");

$modal.style.opacity = "0";

document.addEventListener("click", (e) => {
  if (e.target.matches(".button-rules")) {
    $modal.classList.remove("modal-off");
    $modal.classList.add("modal-on");
    console.log("rules");
  }
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".button-close")) {
    console.log("close");
    $modal.classList.remove("modal-on");
    $modal.classList.add("modal-off");
  }
});

// ** SET GAME ** //
$resultMessage.style.visibility = "hidden";

data.map((el) => {
  createIconButtonGame(el);
});

$gameWrapper.appendChild($fragment);

// ** RESULT GAME ** //
const results = [
  { user: "paper", pc: "paper", message: "draw", result: null },
  { user: "paper", pc: "rock", message: "You win!", result: true },
  { user: "paper", pc: "scissors", message: "You lose", result: false },
  { user: "scissors", pc: "scissors", message: "draw", result: null },
  { user: "scissors", pc: "rock", message: "You lose", result: false },
  { user: "scissors", pc: "paper", message: "You win!", result: true },
  { user: "rock", pc: "rock", message: "draw", result: null },
  { user: "rock", pc: "scissors", message: "You win!", result: true },
  { user: "rock", pc: "paper", message: "You lose", result: false },
];

// Get all the button games
const $pcChoices = document.querySelectorAll(".button-game[data-button]");

let loading = document.createElement("div");

let winnerEffect = null;

let userScore = 0;

let totalScore = 0;

// All options for PC
const pcChoices = [];

$pcChoices.forEach((el) => {
  pcChoices.push(el.dataset.button);
});

let userChoice = null;

const getUserChoice = (value) => {
  return (userChoice = value);
};

const getPcChoice = () => {
  let randomIndex = Math.floor(Math.random() * pcChoices.length);

  return pcChoices[randomIndex];
};

// Get Results
const getResult = (value) => {
  $gameWrapper.style.display = "flex";
  $resultWrapper.style.display = "none";
  $resultMessage.style.visibility = "hidden";
  let finalUserChoise = getUserChoice(value);
  let finalPcChoice = getPcChoice();
  // Total score
  totalScore = totalScore + 1;
  $totalScore.textContent = totalScore;

  // Create user choice icon
  data.find((el) => {
    if (el.name === finalUserChoise) {
      createIconButtonGame(el);
      $userSelection.textContent = "You picked";
      $userSelection.appendChild($fragment);
      $pcSelection.textContent = "The house picked";
      $pcSelection.appendChild(loading);
      loading.classList.add("loading");
    }
  });

  setTimeout(() => {
    results.find((el) => {
      if (el.user === finalUserChoise && el.pc === finalPcChoice) {
        $resultMessageTitle.textContent = el.message;
        $resultMessage.style.visibility = "visible";
        if (el.result === true) {
          winnerEffect = true;
          // User score
          userScore = userScore + 1;
          $userScore.textContent = userScore;
        } else if (el.result === false) {
          winnerEffect = false;
        }
      }
    });

    // Play again button
    $resultMessageButton.addEventListener("click", (e) => {
      $gameWrapper.style.display = "flex";
      $resultWrapper.style.display = "none";

      // Remove ripple effect
      winnerEffect = null;

      $userSelection
        .querySelector("button")
        .classList.remove("button-game-winner");
      $pcSelection
        .querySelector("button")
        .classList.remove("button-game-winner");
    });

    // Create Pc choice icon
    data.find((el) => {
      $pcSelection.appendChild($fragment);
      if (el.name === finalPcChoice) {
        $pcSelection.removeChild(loading);
        createIconButtonGame(el);
        $pcSelection.appendChild($fragment);

        setTimeout(() => {
          // Remove ripple effect
          $userSelection
            .querySelector("button")
            .classList.remove("button-game-winner");
          $pcSelection
            .querySelector("button")
            .classList.remove("button-game-winner");

          // Add ripple effect
          if (winnerEffect === null) {
            return;
          } else if (winnerEffect === true) {
            $userSelection
              .querySelector("button")
              .classList.add("button-game-winner");
          } else if (winnerEffect === false) {
            $pcSelection
              .querySelector("button")
              .classList.add("button-game-winner");
          }
        }, 200);
      }
    });
  }, 2000);
};

// ** START GAME ** //
$buttonsGame.addEventListener("click", (e) => {
  if (e.target.matches(".button-game")) {
    getResult(e.target.dataset.button);
    $gameWrapper.style.display = "none";
    $resultWrapper.style.display = "flex";
  }
});
