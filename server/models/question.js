const questions = [
  {
    id: 1,
    question: `Given an array a that contains only numbers in the range\nfrom 1 to a.length, find the first duplicate number\nfor which the second occurrence has the minimal index.\nIn other words, if there are more than 1 duplicated numbers,\nreturn the number for which the second occurrence has a smaller\nindex than the second occurrence of the other number does.\nIf there are no such elements, return -1.`,
    example: `For a = [2, 1, 3, 5, 3, 2],\nthe output should be\nsolution(a) = 3.\nThere are 2 duplicates: numbers 2 and 3.\nThe second occurrence of 3 has a smaller index than\nthe second occurrence of 2 does, so the answer is 3.\n\nFor a = [2, 2], the output should be solution(a) = 2;\n\nFor a = [2, 4, 3, 5, 1], the output should be solution(a) = -1.`,
    inputsOutputs: [
      {
        inputs: [2, 1, 3, 5, 3, 2],
        output: 3,
      },
      {
        inputs: [8, 4, 6, 2, 6, 4, 7, 9, 5, 8],
        output: 6,
      },
      {
        inputs: [2, 4, 3, 5, 1],
        output: -1,
      },
    ],
  },
  {
    id: 2,
    question: `You are given an n x n 2D matrix that represents an image.\nRotate the image by 90 degrees (clockwise).`,
    example: `For a = [[1, 2, 3],\n         [4, 5, 6],\n         [7, 8, 9]],\n\nthe output should be solution(a) = [[7, 4, 1],\n                                    [8, 5, 2],\n                                    [9, 6, 3]].`,
    inputsOutputs: [
      {
        inputs: [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ],
        output: [
          [7, 4, 1],
          [8, 5, 2],
          [9, 6, 3],
        ],
      },
      {
        inputs: [
          [10, 9, 6, 3, 7],
          [6, 10, 2, 9, 7],
          [7, 6, 3, 8, 2],
          [8, 9, 7, 9, 9],
          [6, 8, 6, 8, 2],
        ],
        output: [
          [6, 8, 7, 6, 10],
          [8, 9, 6, 10, 9],
          [6, 7, 3, 2, 6],
          [8, 9, 8, 9, 3],
          [2, 9, 2, 7, 7],
        ],
      },
      {
        inputs: [
          [40, 12, 15, 37, 33, 11, 45, 13, 25, 3],
          [37, 35, 15, 43, 23, 12, 22, 29, 46, 43],
          [44, 19, 15, 12, 30, 2, 45, 7, 47, 6],
          [48, 4, 40, 10, 16, 22, 18, 36, 27, 48],
          [45, 17, 36, 28, 47, 46, 8, 4, 17, 3],
          [14, 9, 33, 1, 6, 31, 7, 38, 25, 17],
          [31, 9, 17, 11, 29, 42, 38, 10, 48, 6],
          [12, 13, 42, 3, 47, 24, 28, 22, 3, 47],
          [38, 23, 26, 3, 23, 27, 14, 40, 15, 22],
          [8, 46, 20, 21, 35, 4, 36, 18, 32, 3],
        ],
        output: [
          [8, 38, 12, 31, 14, 45, 48, 44, 37, 40],
          [46, 23, 13, 9, 9, 17, 4, 19, 35, 12],
          [20, 26, 42, 17, 33, 36, 40, 15, 15, 15],
          [21, 3, 3, 11, 1, 28, 10, 12, 43, 37],
          [35, 23, 47, 29, 6, 47, 16, 30, 23, 33],
          [4, 27, 24, 42, 31, 46, 22, 2, 12, 11],
          [36, 14, 28, 38, 7, 8, 18, 45, 22, 45],
          [18, 40, 22, 10, 38, 4, 36, 7, 29, 13],
          [32, 15, 3, 48, 25, 17, 27, 47, 46, 25],
          [3, 22, 47, 6, 17, 3, 48, 6, 43, 3],
        ],
      },
    ],
  },
  {
    id: 3,
    question: `Given a string s consisting of small English letters,\nfind and return the first instance of a non-repeating character\nin it. If there is no such character, return '_'.`,
    example: `For s = "abacabad", the output should be\nsolution(s) = 'c'.\nThere are 2 non-repeating characters in the string: 'c' and 'd'.\nReturn c since it appears in the string first.\n\nFor s = "abacabaabacaba", the output should be\nsolution(s) = '_'.\nThere are no characters in this string that do not repeat.`,
    inputsOutputs: [
      {
        inputs: "abacabad",
        output: "c",
      },
      {
        inputs: "abacabaabacaba",
        output: "_",
      },
      {
        inputs: "abcdefghijklmnopqrstuvwxyziflskecznslkjfabe",
        output: "d",
      },
    ],
  },
];

module.exports = {
  getRandomQuestion: () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  },
};
