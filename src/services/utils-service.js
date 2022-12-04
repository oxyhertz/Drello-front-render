function makeId(length = 8) {
  var txt = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    txt += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return txt;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

export const utilService = {
  makeId,
  debounce,
  getRandomInt,
  getRandomColor,
  getRandomWord,
  isDarkColor,
  getLoremIpsum,
  loadFromStorage,
  saveToStorage,
  loadFromSessionStorage,
  saveToSessionStorage,
};

function getLoremIpsum(length = 5) {
  const words = [
    'The sky',
    'above',
    'the port',
    'was',
    'the color of television',
    'tuned',
    'to',
    'a dead channel',
    '.',
    'All',
    'this happened',
    'more or less',
    '.',
    'I',
    'had',
    'the story',
    'bit by bit',
    'from various people',
    'and',
    'as generally',
    'happens',
    'in such cases',
    'each time',
    'it',
    'was',
    'a different story',
    '.',
    'It',
    'was',
    'a pleasure',
    'to',
    'burn',
  ];
  let sentence = '';
  while (length > 0) {
    sentence += words[getRandomInt(0, words.length - 1)] + ' ';
    length--;
  }
  return sentence.trim();
}

function getRandomWord(count = 5){
  let words = [
    'Animal',
    'Africa',
    'Moscow',
    'Ukraine',
    'Space',
    'Motorcycle',
    'Yamaha',
    'Life',
    'Business',
    'Nature',
    'Colorful',
    'Productivity',
    'Gaming'
  ]
  let chosenWords = []
  for(var i = 0 ; i < count; i++){
    let randIdx = getRandomInt(0,words.length-1);
    chosenWords.push(words[randIdx]);
    words.splice(randIdx,1)
  }
  return chosenWords;
}

function getRandomColor() {
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}

function isDarkColor(c) {
  c = c.substring(1) // strip #
  const rgb = parseInt(c, 16) // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff // extract red
  const g = (rgb >> 8) & 0xff // extract green
  const b = (rgb >> 0) & 0xff // extract blue
  var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709

  return luma < 100
}

function debounce(func, wait) {
  let timeout;

  return function executedFunction(...args) {
    //rest-makes the args to an array
    const later = () => {
      clearTimeout(timeout);
      func(...args); //spread-from array to vars
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

function saveToStorage(key, val) {
  localStorage[key] = JSON.stringify(val);
}

function loadFromSessionStorage(key) {
  var val = sessionStorage.getItem(key);
  return val ? JSON.parse(val) : null;
}

function saveToSessionStorage(key, val) {
  sessionStorage[key] = JSON.stringify(val);
}
