const questions = [
  {
    id: 1,
    name: "First Duplicate",
    suggestedTime: "15 mins",
    difficulty: "Easy",
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
    name: "Rotate Image",
    suggestedTime: "15 mins",
    difficulty: "Easy",
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
    name: "First Non-Repeating Character",
    suggestedTime: "15 mins",
    difficulty: "Easy",
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
  {
    id: 4,
    name: "Climbing Stairs",
    suggestedTime: "15 mins",
    difficulty: "Easy",
    question: `You are climbing a staircase that has n steps. You can take\nthe steps either 1 or 2 at a time. Calculate how many distinct\nways you can climb to the top of the staircase.`,
    example: `For n = 1, the output should be\nsolution(n) = 1;\n\nFor n = 2, the output should be\nsolution(n) = 2.\nYou can either climb 2 steps at once or climb 1 step two times.`,
    inputsOutputs: [
      {
        inputs: 26,
        output: 196418,
      },
      {
        inputs: 38,
        output: 63245986,
      },
      {
        inputs: 13,
        output: 377,
      },
    ],
  },
  {
    id: 5,
    name: "Maximal Square",
    suggestedTime: "45 mins",
    difficulty: "Hard",
    question: `You have a 2D binary matrix that's filled with 0s and 1s.\nIn the matrix, find the largest square that contains only 1s\nand return its area.`,
    example: `For\n\nmatrix = [\n    ['1', '0', '1', '1', '1'],\n    ['1', '0', '1', '1', '1'],\n    ['1', '1', '1', '1', '1'],\n    ['1', '0', '0', '1', '0'],\n    ['1', '0', '0', '1', '0']\n]\n\nthe output should be\nsolution(matrix) = 9.`,
    inputsOutputs: [
      {
        inputs: [
          ["1", "0", "1", "1", "1"],
          ["1", "0", "1", "1", "1"],
          ["1", "1", "1", "1", "1"],
          ["1", "0", "0", "1", "0"],
          ["1", "0", "0", "1", "0"],
        ],
        output: 9,
      },
      {
        inputs: [
          ["1", "0", "1", "0", "0"],
          ["1", "0", "1", "1", "1"],
          ["1", "1", "1", "1", "1"],
          ["1", "0", "0", "1", "0"],
        ],
        output: 4,
      },
      {
        inputs: [
          ["1", "1", "1", "0", "0"],
          ["1", "1", "1", "0", "0"],
          ["1", "1", "1", "1", "1"],
          ["0", "1", "1", "1", "1"],
          ["0", "1", "1", "1", "1"],
          ["0", "1", "1", "1", "1"],
        ],
        output: 16,
      },
    ],
  },
  {
    id: 6,
    name: "Longest Increasing Subsequence",
    suggestedTime: "45 mins",
    difficulty: "Hard",
    question: `Given a sequence of numbers in an array, find the length of its\nlongest increasing subsequence (LIS).\nThe longest increasing subsequence is a subsequence of a given\nsequence in which the subsequence's elements are in strictly\nincreasing order, and in which the subsequence is as long as\npossible. This subsequence is not necessarily contiguous or unique.`,
    example: `For sequence = [1, 231, 2, 4, 89, 32, 12, 234, 33, 90, 34, 100],\n\nthe output should be\nsolution(sequence) = 7.\n\nThe LIS itself is [1, 2, 4, 32, 33, 34, 100].`,
    inputsOutputs: [
      {
        inputs: [1, 231, 2, 4, 89, 32, 12, 234, 33, 90, 34, 100],
        output: 7,
      },
      {
        inputs: [1, 231, 2, 4, 89, 32, 12, 234, 33, 90, 34, 42, 88, 15, 16, 100],
        output: 9,
      },
      {
        inputs: [45, 40, 27, 24, 38, 39, 19, 83, 30, 42, 34, 16, 40, 59],
        output: 5,
      },
    ],
  },
  {
    id: 7,
    name: "Contains Duplicates",
    suggestedTime: "15 mins",
    difficulty: "Easy",
    question: `Given an array of integers, write a function that determines\nwhether the array contains any duplicates. Your function should\nreturn true if any element appears at least twice in the array,\nand it should return false if every element is distinct.`,
    example: `For a = [1, 2, 3, 1], the output should be\nsolution(a) = true.\nThere are two 1s in the given array.\n\nFor a = [3, 1], the output should be\nsolution(a) = false.\nThe given array contains no duplicates.`,
    inputsOutputs: [
      {
        inputs: [1, 2, 3, 1],
        output: true,
      },
      {
        inputs: [1, 2, 3, 4],
        output: false,
      },
      {
        inputs: [0, 1, 0, -1],
        output: true,
      },
    ],
  },
  {
    id: 8,
    name: "Ammend The Sentence",
    suggestedTime: "15 mins",
    difficulty: "Easy",
    question: `You have been given a string s, which is supposed to be a sentence.\nHowever, someone forgot to put spaces between the different words,\nand for some reason they capitalized the first letter of every word.\nReturn the sentence after making the following amendments:\n\n- Put a single space between the words.\n- Convert the uppercase letters to lowercase.`,
    example: `For s = "ProgrammingIsAwesome", the output should be\nsolution(s) = "programming is awesome".\n\nFor s = "Hello", the output should be\nsolution(s) = "hello".`,
    inputsOutputs: [
      {
        inputs: "ProgrammingIsAwesome",
        output: "programming is awesome",
      },
      {
        inputs: "vSKwWDjwIerQKMgVaAniorRJlerbKpDgvyKBLPNwSRWtylqKewNFtERNuUBBHAsGkTSSfdhQHJYvAighAdeG",
        output: "v s kw w djw ier q k mg va anior r jlerb kp dgvy k b l p nw s r wtylq kew n ft e r nu u b b h as gk t s sfdh q h j yv aigh ade g",
      },
      {
        inputs: "iEiMCyKAdsfGMPa",
        output: "i ei m cy k adsf g m pa",
      },
    ],
  },
  {
    id: 9,
    name: "Bubble Sort",
    suggestedTime: "15 mins",
    difficulty: "Easy",
    question: `Given an array of integers, sort it using the bubble sort algorithm.`,
    example: `For items = [2, 4, 1, 5], the output should be\nsolution(items) = [1, 2, 4, 5].`,
    inputsOutputs: [
      {
        inputs: [2, 4, 1, 5],
        output: [1, 2, 4, 5],
      },
      {
        inputs: [3, 6, 1, 5, 3, 6],
        output: [1, 3, 3, 5, 6, 6],
      },
      {
        inputs: [2, 8, 2, 9, 3, 2, 10, 7, 3],
        output: [2, 2, 2, 3, 3, 7, 8, 9, 10],
      },
    ],
  },
  {
    id: 10,
    name: "Merge Sort",
    suggestedTime: "15 mins",
    difficulty: "Easy",
    question: `Sort an array of integers using the merge sort algorithm.`,
    example: `For sequence = [3, 6, 1, 5, 3, 6], the output should be\nsolution(sequence) = [1, 3, 3, 5, 6, 6].`,
    inputsOutputs: [
      {
        inputs: [3, 6, 1, 5, 3, 6],
        output: [1, 3, 3, 5, 6, 6],
      },
      {
        inputs: [3, 5, 2, 4, 3, 7],
        output: [2, 3, 3, 4, 5, 7],
      },
      {
        inputs: [-10, -20, 0],
        output: [-20, -10, 0],
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
