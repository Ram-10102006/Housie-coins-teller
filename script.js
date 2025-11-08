const grid = document.getElementById('grid');
const display = document.getElementById('display');
const generateBtn = document.getElementById('generateBtn');
const autoBtn = document.getElementById('autoBtn');
const resetBtn = document.getElementById('resetBtn');
const languageSelect = document.getElementById('language');
const prevBtn = document.getElementById('prevBtn');
const prevDisplay = document.getElementById('prevDisplay');

let numbers = Array.from({ length: 90 }, (_, i) => i + 1);
let remaining = [...numbers];
let history = [];
let autoInterval = null;

function createGrid() {
  grid.innerHTML = "";
  numbers.forEach(num => {
    const div = document.createElement('div');
    div.classList.add('number');
    div.textContent = num;
    grid.appendChild(div);
  });
}
createGrid();
let allButtons = document.querySelectorAll('.number');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(remaining);

const teluguMap = {
  1:"ఒకటి",2:"రెండు",3:"మూడు",4:"నాలుగు",5:"ఐదు",6:"ఆరు",7:"ఏడు",8:"ఎనిమిది",9:"తొమ్మిది",10:"పది",
  11:"పదకొండు",12:"పన్నెండు",13:"పదమూడు",14:"పద్నాలుగు",15:"పదిహేను",16:"పదహారు",17:"పదిహేడు",
  18:"పద్దెనిమిది",19:"పందొమ్మిది",20:"ఇరవై",30:"ముప్పై",40:"నలభై",50:"యాభై",60:"అరవై",70:"డెబ్బై",80:"ఎనభై",90:"తొంభై"
};

function numberToTelugu(num) {
  if (teluguMap[num]) return teluguMap[num];
  if (num < 100) {
    let tens = Math.floor(num / 10) * 10;
    let ones = num % 10;
    return (teluguMap[tens] || '') + ' ' + (teluguMap[ones] || '');
  }
  return num.toString();
}

function speakNumber(num) {
  const lang = languageSelect.value;
  const utter = new SpeechSynthesisUtterance();
  utter.rate = 0.9;
  if (lang === 'en') {
    utter.lang = 'en-IN';
    utter.text = num.toString();
  } else {
    utter.lang = 'te-IN';
    utter.text = numberToTelugu(num);
  }
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}

function generateNumber() {
  if (remaining.length === 0) {
    display.textContent = "END";
    speakNumber("Game over");
    clearInterval(autoInterval);
    autoInterval = null;
    autoBtn.classList.remove('active');
    autoBtn.textContent = "Start Auto Generate";
    return;
  }
  const num = remaining.pop();
  display.textContent = num;
  allButtons[num - 1].classList.add('drawn');
  speakNumber(num);
  history.push(num);

  // Update previous number display
  if (history.length > 1) {
    prevDisplay.textContent = history[history.length - 2];
  }
}

generateBtn.addEventListener('click', generateNumber);

autoBtn.addEventListener('click', () => {
  if (autoInterval) {
    clearInterval(autoInterval);
    autoInterval = null;
    autoBtn.classList.remove('active');
    autoBtn.textContent = "Start Auto Generate";
  } else {
    autoBtn.classList.add('active');
    autoBtn.textContent = "Stop Auto Generate";
    generateNumber();
    autoInterval = setInterval(generateNumber, 4000);
  }
});

resetBtn.addEventListener('click', () => {
  clearInterval(autoInterval);
  autoInterval = null;
  autoBtn.classList.remove('active');
  autoBtn.textContent = "Start Auto Generate";
  display.textContent = "--";
  prevDisplay.textContent = "--";
  remaining = [...numbers];
  history = [];
  shuffle(remaining);
  createGrid();
  allButtons = document.querySelectorAll('.number');
  speechSynthesis.cancel();
});

prevBtn.addEventListener('click', () => {
  if (history.length < 2) {
    prevDisplay.textContent = "--";
    return;
  }
  const current = history.pop();
  const prev = history[history.length - 1];
  display.textContent = prev;
  prevDisplay.textContent = history[history.length - 2] || "--";
  speakNumber(prev);
});
