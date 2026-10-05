const header = document.createElement("header");
header.classList.add("header");

const newGameButton = document.createElement("button");
newGameButton.textContent = "Новая Игра";
newGameButton.classList.add("new-game");

const leadersButton = document.createElement("button");
leadersButton.textContent = "Доска лидеров";
leadersButton.classList.add("leaders");

header.append(newGameButton, leadersButton);
document.body.append(header);

const board = document.createElement("main");
board.classList.add("board");
document.body.append(board);

const stats = document.createElement("div");
stats.classList.add("stats");

const movesCounter = document.createElement("p");
movesCounter.textContent = "Ходы: 0";
movesCounter.classList.add("moves");

const pairsCounter = document.createElement("p");
pairsCounter.textContent = "Пары: 0 из 8";
pairsCounter.classList.add("pairs");

stats.append(movesCounter, pairsCounter);
board.append(stats);

const images = [
  "assets/img/1.png",
  "assets/img/2.png",
  "assets/img/3.png",
  "assets/img/4.png",
  "assets/img/5.png",
  "assets/img/6.png",
  "assets/img/7.png",
  "assets/img/8.png",
];

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

const cardImages = [...images, ...images];

let firstCard = null;
let closeTimerId = null;
let lock = false;
let moves = 0;
let pairs = 0;

const updateStats = () => {
  movesCounter.textContent = `Ходы: ${moves}`;
  pairsCounter.textContent = `Пары: ${pairs} из 8`;
};

const createDialog = () => {
  const dialog = document.createElement("dialog");
  const closeButton = document.createElement("button");
  closeButton.textContent = "Закрыть";
  dialog.append(closeButton);
  document.body.append(dialog);

  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  return dialog;
};

const winDialog = createDialog();
const winTitle = document.createElement("h2");
winTitle.textContent = "Победа!";
const winMessage = document.createElement("p");
winMessage.textContent = "Ходов: 0";
const winNewGameButton = document.createElement("button");
winNewGameButton.textContent = "Новая игра";
winDialog.prepend(winTitle, winMessage, winNewGameButton);
winNewGameButton.addEventListener("click", () => {
  startNewGame();
  winDialog.close();
});

const leadersDialog = createDialog();
const leadersTitle = document.createElement("h2");
leadersTitle.textContent = "Доска лидеров";
const leadersList = document.createElement("ol");
const leadersEmpty = document.createElement("p");
leadersEmpty.textContent = "Пока нет результатов";
leadersDialog.prepend(leadersTitle, leadersList, leadersEmpty);

const getFormattedDate = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const date = `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year}`;
  return date;
};

const saveResult = (moves) => {
  const stored = localStorage.getItem("results");
  const results = stored ? JSON.parse(stored) : [];
  const newResult = { moves, date: getFormattedDate() };
  results.push(newResult);
  localStorage.setItem("results", JSON.stringify(results));
};

const loadResults = () => {
  const stored = localStorage.getItem("results");
  return stored ? JSON.parse(stored) : [];
};

leadersButton.addEventListener("click", () => {
  const results = loadResults();
  if (results.length === 0) {
    leadersEmpty.style.display = "block";
    leadersList.style.display = "none";
  } else {
    leadersEmpty.style.display = "none";
    leadersList.style.display = "block";
    const oldItems = leadersList.querySelectorAll("li");
    oldItems.forEach((li) => li.remove());
    results.sort((a, b) => a.moves - b.moves);
    const top10 = results.slice(0, 10);
    top10.forEach((result, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${result.moves} ходов — ${result.date}`;
      leadersList.append(li);
    });
  }
  leadersDialog.showModal();
});

board.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (lock) return;
  if (!card) return;
  if (card.classList.contains("card-open")) return;
  if (card.classList.contains("card-matched")) return;
  card.classList.add("card-open");

  if (firstCard === null) {
    firstCard = card;
    return;
  }
  moves += 1;
  updateStats();

  if (firstCard.dataset.id === card.dataset.id) {
    firstCard.classList.add("card-matched");
    card.classList.add("card-matched");
    firstCard = null;
    pairs += 1;
    updateStats();
    if (pairs === 1) {
      winMessage.textContent = `Ходов: ${moves}`;
      saveResult(moves);
      winDialog.showModal();
    }
  } else {
    lock = true;
    closeTimerId = setTimeout(() => {
      firstCard.classList.remove("card-open");
      card.classList.remove("card-open");
      firstCard = null;
      lock = false;
      closeTimerId = null;
    }, 1000);
  }
});

const createCards = () => {
  const cards = board.querySelectorAll(".card");
  cards.forEach((card) => card.remove());
  shuffle(cardImages);
  for (const item of cardImages) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = images.indexOf(item);
    const img = document.createElement("img");
    img.classList.add("card-image");
    img.src = item;
    img.alt = `Пара ${images.indexOf(item) + 1}`;
    card.append(img);
    board.append(card);
  }
};

const startNewGame = () => {
  if (closeTimerId) {
    clearTimeout(closeTimerId);
    closeTimerId = null;
  }
  moves = 0;
  pairs = 0;
  firstCard = null;
  lock = false;
  updateStats();
  createCards();
  winDialog.close();
};

createCards();
newGameButton.addEventListener("click", startNewGame);