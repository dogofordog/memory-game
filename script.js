const header = document.createElement('header');
header.classList.add('header');

const newGameButton =document.createElement('button');
newGameButton.textContent = 'New Game';
newGameButton.classList.add('new-game');

const leadersButton = document.createElement('button');
leadersButton.textContent = 'Leaderboard';
leadersButton.classList.add('leaders');

header.append(newGameButton,leadersButton);

document.body.append(header);

const board = document.createElement('main');
board.classList.add('board');

document.body.append(board)

const stats = document.createElement('div');
stats.classList.add('stats');

const movesCounter = document.createElement('p');
movesCounter.textContent = 'Moves: 0';
movesCounter.classList.add('moves');

const pairsCounter = document.createElement('p');
pairsCounter.textContent = 'Pairs: 0 из 8';
pairsCounter.classList.add('pairs');

stats.append(movesCounter, pairsCounter);
board.append(stats);