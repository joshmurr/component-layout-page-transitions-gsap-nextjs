const shuffle = (arr: any[]) => {
  const shuffled = [...arr];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const simpleHash = (s: string) => {
  return s.split("").reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
};

const keyed = (word: string) => {
  return {
    word,
    hash: simpleHash(word),
  };
};

const addSpaces = (s: string, index: number, arr: string[]) => {
  return index !== arr.length - 1 ? `${s} ` : s;
};

const sentence = "The quick brown fox jumps over the lazy dog.";
const words = sentence.split(" ").map(addSpaces).map(keyed);
const shuffled = shuffle(words);

export { sentence, words, shuffled };
