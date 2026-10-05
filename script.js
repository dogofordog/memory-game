const header = document.createElement('header');
header.classList.add('header');

const newGameButton =document.createElement('button');
newGameButton.textContent = 'Новая Игра';
newGameButton.classList.add('new-game');

const leadersButton = document.createElement('button');
leadersButton.textContent = 'Доска лидеров';
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

const images = [
  'assets/img/1.png',
  'assets/img/2.png',
  'assets/img/3.png',
  'assets/img/4.png',
  'assets/img/5.png',
  'assets/img/6.png',
  'assets/img/7.png',
  'assets/img/8.png',
];

const shuffle = (array)=>{
    for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];   
    array[i] = array[j];     
    array[j] = temp; 
}
return array;
}

const cardImages = [...images, ...images];
shuffle(cardImages);
for (const item of cardImages) {
const card = document.createElement('div');
card.classList.add('card');
card.dataset.id = images.indexOf(item);
const img = document.createElement('img');
img.classList.add('card-image');
img.src = item;
img.alt = 'Картинка';
card.append(img);
board.append(card);
}
let firstCard = null;
let lock = false;
let moves = 0;
let pairs = 0;

const updateStats = () =>{
movesCounter.textContent = `Moves: ${moves}`;
pairsCounter.textContent = `Pairs: ${pairs} из 8`;
}

const winDialog = document.createElement('dialog');
const winTitle = document.createElement('h2');
winTitle.textContent = 'Победа!'
const winMessage = document.createElement('p');
winMessage.textContent = 'Ходов: 0';
const winCloseButton = document.createElement('button');
winCloseButton.textContent = 'Закрыть'
winDialog.append(winTitle, winMessage, winCloseButton);
document.body.append(winDialog);
winCloseButton.addEventListener('click', () => { 
    winDialog.close(); });

board.addEventListener('click',(event)=>{
const card = event.target.closest('.card');
if (lock) return;
if (!card)
    return; 
if (card.classList.contains('card-open'))
    return;
if (card.classList.contains('card-matched'))
    return;
card.classList.add('card-open');

if (firstCard === null) {
  firstCard = card;
  return; 
}
moves += 1;
updateStats();

if (firstCard.dataset.id === card.dataset.id) {
firstCard.classList.add('card-matched');
card.classList.add('card-matched');
firstCard=null;
pairs += 1;
updateStats();
if (pairs===8){
winMessage.textContent = `Ходов: ${moves}`;
winDialog.showModal();
}

}

else {
    lock = true;
    setTimeout(() => {
      firstCard.classList.remove('card-open');
      card.classList.remove('card-open');
      firstCard = null;
      lock = false;
    }, 1000);
}
});


