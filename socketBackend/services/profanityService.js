const profanityList = ["fuck", "bastard", "ass" , "sex"];

function createRegexPattern(word) {
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
  const pattern = [...escapedWord].map(char => `${char}\\w*`).join(''); // Allow any number of optional characters between each letter

  return `\\b${pattern}\\b`;
}

const profanityPatterns = profanityList.map(createRegexPattern);
const combinedPattern = new RegExp(`(${profanityPatterns.join('|')})`, 'gi');

function filterProfanity(input) {
  return input.replace(combinedPattern, (match) => '*'.repeat(match.length));
}