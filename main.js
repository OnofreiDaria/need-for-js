const score = document.querySelector('.score'),
  start = document.querySelector('.start'),
  gameArea = document.querySelector('.gameArea'),
  car = document.createElement('div'),
  music = document.createElement('audio');
// music.setAttribute('controls', 'controls');

car.classList.add('car');
let topScore = localStorage.getItem('topScore');

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3,
  level: 0
};

const getQuantityElements = heightElement => Math.ceil(gameArea.offsetHeight / heightElement);

const startGame = (event) => {

    if(event.target.classList.contains('start')) {
      return;
    }
  if(event.target.classList.contains('easy')) {
    setting.speed = 3;
    setting.traffic = 3;
  }
  if(event.target.classList.contains('medium')) {
    setting.speed = 5;
    setting.traffic = 3;
  }
  if(event.target.classList.contains('difficult')) {
    setting.speed = 7;
    setting.traffic = 2;
  }

  start.classList.add('hide');
  gameArea.innerHTML = '';

  for (let i = 0; i < getQuantityElements(100) + 1; i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for(let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    let enemyImg = Math.floor(Math.random() * 4) + 1;
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url('./image/enemy${enemyImg}.png') center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }
  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);

  music.setAttribute('autoplay', true);
  music.setAttribute('src', './image/audio.mp3');
  gameArea.appendChild(music);
};

const playGame = () => {
  if(setting.score > 1000 && setting.level === 0) {
    setting.speed++;
    setting.level++;
  } else if (setting.score > 3000 && setting.level === 1) {
    setting.speed++;
    setting.level++;
  } else if (setting.score > 5000 && setting.level === 2) {
    setting.speed++;
    setting.level++;
  }
  setting.score += setting.speed;
  score.innerHTML = 'SCORE<br>' + setting.score;
  moveRoad();
  moveEnemy();
  if(keys.ArrowLeft && setting.x > 0) {
    setting.x -= setting.speed;
  }
  if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
    setting.x += setting.speed;
  }
  if(keys.ArrowUp && setting.y > 0) {
    setting.y -= setting.speed;
  }
  if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
    setting.y += setting.speed;
  }
  car.style.left = setting.x + 'px';
  car.style.top = setting.y + 'px';
  if(setting.start) {
    requestAnimationFrame(playGame);
  }
}

const startRun = (event) => {
  event.preventDefault();
  if(event.key in keys) {
    keys[event.key] = true;
  }
}
const stopRun = (event) => {
  event.preventDefault();
  if(event.key in keys) {
    keys[event.key] = false;
  }
}

const moveRoad = () => {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';

    if(line.y >= gameArea.clientHeight) {
      line.y = -100;
    }
  });
}

const moveEnemy = () => {
  let enemy = document.querySelectorAll('.enemy');

  enemy.forEach( item =>{
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if(carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= carRect.right &&
      carRect.bottom >= enemyRect.top) {
      setting.start = false;
      music.pause();
      if(topScore < setting.score) {
        localStorage.setItem('topScore',setting.score);
      }

      start.classList.remove('hide');
      start.style.top = score.offsetHeight;
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';

    if(item.y >= document.documentElement.clientHeight) {
      let enemyImg = Math.floor(Math.random() * 4) + 1;

      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      item.style.background = `transparent url('./image/enemy${enemyImg}.png') center / cover no-repeat`;

    }
  });
}

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
