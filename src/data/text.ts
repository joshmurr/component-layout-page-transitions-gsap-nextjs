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

const keyed = (word: string, index: number) => {
  return {
    word,
    hash: simpleHash(word + index),
  };
};

const addSpaces = (s: string, index: number, arr: string[]) => {
  return index !== arr.length - 1 ? `${s} ` : s;
};

const sentence =
  "Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.";
const words = sentence.split(" ").map(addSpaces).map(keyed);
const shuffled = shuffle(words);

export { sentence, words, shuffled };
