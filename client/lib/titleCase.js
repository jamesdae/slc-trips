export default function titleCase(title) {
  const low = ['and', 'or', 'nor', 'but', 'a', 'an', 'the', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'per', 'to'];
  const newArray = title.split(' ');
  for (let i = 0; i < newArray.length; i++) {
    let newWord = '';
    const lowerword = newArray[i].toLowerCase();
    const previousWord = newArray[i - 1];
    if (low.includes(lowerword) && i !== 0 && previousWord[previousWord.length - 1] !== ':') {
      newWord = lowerword;
    } else if (!low.includes(lowerword) || newArray[i] === newArray[0] || previousWord[previousWord.length - 1] === ':') {
      newWord += newArray[i][0].toUpperCase();
      newWord += newArray[i].substring(1).toLowerCase();
    }
    if (newWord.toLowerCase() === 'javascript') {
      newWord = 'JavaScript';
    }
    if (newWord.toLowerCase() === 'javascript:') {
      newWord = 'JavaScript:';
    }
    if (newWord.toLowerCase() === 'api') {
      newWord = 'API';
    }
    if (newWord.includes('_')) {
      newWord = newWord.split('_');
      newWord[1] = newWord[1][0].toUpperCase() + newWord[1].substring(1);
      newWord = newWord[0] + ' ' + newWord[1];
    }
    newArray[i] = newWord;
  } return newArray.join(' ');
}
