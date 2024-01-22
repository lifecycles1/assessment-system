const challengeData = [
  {
    title: "First Duplicate",
    learningPath: "Arrays",
    suggestedTime: "15 mins",
    difficulty: "easy",
    question: `Given an array a that contains only numbers in the range\nfrom 1 to a.length, find the first duplicate number\nfor which the second occurrence has the minimal index.\nIn other words, if there are more than 1 duplicated numbers,\nreturn the number for which the second occurrence has a smaller\nindex than the second occurrence of the other number does.\nIf there are no such elements, return -1.`,
    example: `For a = [2, 1, 3, 5, 3, 2],\nthe output should be\nsolution(a) = 3.\nThere are 2 duplicates: numbers 2 and 3.\nThe second occurrence of 3 has a smaller index than\nthe second occurrence of 2 does, so the answer is 3.\n\nFor a = [2, 2], the output should be solution(a) = 2;\n\nFor a = [2, 4, 3, 5, 1], the output should be solution(a) = -1.`,
    inputsOutputs: [
      {
        inputs: [[2, 1, 3, 5, 3, 2]],
        output: 3,
      },
      {
        inputs: [[8, 4, 6, 2, 6, 4, 7, 9, 5, 8]],
        output: 6,
      },
      {
        inputs: [[2, 4, 3, 5, 1]],
        output: -1,
      },
    ],
  },
  {
    title: "First Non-Repeating Character",
    learningPath: "Arrays",
    suggestedTime: "15 mins",
    difficulty: "easy",
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
    title: "Rotate Image",
    learningPath: "Arrays",
    suggestedTime: "15 mins",
    difficulty: "easy",
    question: `You are given an n x n 2D matrix that represents an image.\nRotate the image by 90 degrees (clockwise).`,
    example: `For a = [[1, 2, 3],\n         [4, 5, 6],\n         [7, 8, 9]],\n\nthe output should be solution(a) = [[7, 4, 1],\n                                    [8, 5, 2],\n                                    [9, 6, 3]].`,
    inputsOutputs: [
      {
        inputs: [
          [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],
          ],
        ],
        output: [
          [7, 4, 1],
          [8, 5, 2],
          [9, 6, 3],
        ],
      },
      {
        inputs: [
          [
            [10, 9, 6, 3, 7],
            [6, 10, 2, 9, 7],
            [7, 6, 3, 8, 2],
            [8, 9, 7, 9, 9],
            [6, 8, 6, 8, 2],
          ],
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
          [
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
    title: "Sudoku 2",
    learningPath: "Arrays",
    suggestedTime: "30 mins",
    difficulty: "easy",
    question: `Sudoku is a number-placement puzzle. The objective is to fill a 9 × 9 grid\nwith numbers in such a way that each column, each row, and each of the\nnine 3 × 3 sub-grids that compose the grid all contain all of the numbers\nfrom 1 to 9 one time. Implement an algorithm that will check whether the\ngiven grid of numbers represents a valid Sudoku puzzle according to the\nlayout rules described above. Note that the puzzle represented by grid does\nnot have to be solvable.`,
    example: `For grid = [['.', '.', '.', '1', '4', '.', '.', '2', '.'],
            ['.', '.', '6', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '1', '.', '.', '.', '.', '.', '.'],
            ['.', '6', '7', '.', '.', '.', '.', '.', '9'],
            ['.', '.', '.', '.', '.', '.', '8', '1', '.'],
            ['.', '3', '.', '.', '.', '.', '.', '.', '6'],
            ['.', '.', '.', '.', '.', '7', '.', '.', '.'],
            ['.', '.', '.', '5', '.', '.', '.', '7', '.']] \n\nthe output should be\nsolution(grid) = true;\n\nFor grid = [['.', '.', '.', '.', '2', '.', '.', '9', '.'],
            ['.', '.', '.', '.', '6', '.', '.', '.', '.'],
            ['7', '1', '.', '.', '7', '5', '.', '.', '.'],
            ['.', '7', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '8', '3', '.', '.', '.'],
            ['.', '.', '8', '.', '.', '7', '.', '6', '.'],
            ['.', '.', '.', '.', '.', '2', '.', '.', '.'],
            ['.', '1', '.', '2', '.', '.', '.', '.', '.'],
            ['.', '2', '.', '.', '3', '.', '.', '.', '.']] \n\nthe output should be\nsolution(grid) = false.\nThe given grid is not correct because there are two 1s in the second column.\nEach column, each row, and each 3 × 3 subgrid can only contain the numbers\n1 through 9 one time.`,
    inputsOutputs: [
      {
        inputs: [
          [
            [".", ".", "4", ".", ".", ".", "6", "3", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", "."],
            ["5", ".", ".", ".", ".", ".", ".", "9", "."],
            [".", ".", ".", "5", "6", ".", ".", ".", "."],
            ["4", ".", "3", ".", ".", ".", ".", ".", "1"],
            [".", ".", ".", "7", ".", ".", ".", ".", "."],
            [".", ".", ".", "5", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", "."],
          ],
        ],
        output: false,
      },
      {
        inputs: [
          [
            [".", ".", ".", ".", ".", ".", ".", ".", "2"],
            [".", ".", ".", ".", ".", ".", "6", ".", "."],
            [".", ".", "1", "4", ".", ".", "8", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", "3", ".", ".", ".", "."],
            ["5", ".", "8", "6", ".", ".", ".", ".", "."],
            [".", "9", ".", ".", ".", ".", "4", ".", "."],
            [".", ".", ".", ".", "5", ".", ".", ".", "."],
          ],
        ],
        output: true,
      },
      {
        inputs: [
          [
            [".", "9", ".", ".", "4", ".", ".", ".", "."],
            ["1", ".", ".", ".", ".", ".", "6", ".", "."],
            [".", ".", "3", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", "7", ".", ".", ".", ".", "."],
            ["3", ".", ".", ".", "5", ".", ".", ".", "."],
            [".", ".", "7", ".", ".", "4", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", "7", ".", ".", ".", "."],
          ],
        ],
        output: true,
      },
    ],
  },
  {
    title: "isCryptSolution",
    learningPath: "Arrays",
    suggestedTime: "15 mins",
    difficulty: "easy",
    question: `A cryptarithm is a mathematical puzzle for which the goal is to find the correspondence between letters and digits, such that the given arithmetic equation consisting of letters holds true when the letters are converted to digits.

    You have an array of strings crypt, the cryptarithm, and an an array containing the mapping of letters and digits, solution. The array crypt will contain three non-empty strings that follow the structure: [word1, word2, word3], which should be interpreted as the word1 + word2 = word3 cryptarithm.
    
    If crypt, when it is decoded by replacing all of the letters in the cryptarithm with digits using the mapping in solution, becomes a valid arithmetic equation containing no numbers with leading zeroes, the answer is true. If it does not become a valid arithmetic solution, the answer is false.
    
    Note that number 0 doesn't contain leading zeroes (while for example 00 or 0123 do)`,
    example: `For crypt = ["SEND", "MORE", "MONEY"] and
    solution = [['O', '0'],
            ['M', '1'],
            ['Y', '2'],
            ['E', '5'],
            ['N', '6'],
            ['D', '7'],
            ['R', '8'],
            ['S', '9']]
            the output should be
solution(crypt, solution) = true.
When you decrypt "SEND", "MORE", and "MONEY" using the mapping given in crypt, you get 9567 + 1085 = 10652 which is correct and a valid arithmetic equation.

For crypt = ["TEN", "TWO", "ONE"] and

solution = [['O', '1'],
            ['T', '0'],
            ['W', '9'],
            ['E', '5'],
            ['N', '4']]
            
            the output should be
solution(crypt, solution) = false.

Even though 054 + 091 = 145, 054 and 091 both contain leading zeroes, meaning that this is not a valid solution.`,
    inputsOutputs: [
      {
        inputs: [
          ["ONE", "ONE", "TWO"],
          [
            ["O", "2"],
            ["T", "4"],
            ["W", "6"],
            ["E", "1"],
            ["N", "3"],
          ],
        ],
        output: true,
      },
      {
        inputs: [
          ["ONE", "ONE", "TWO"],
          [
            ["O", "0"],
            ["T", "1"],
            ["W", "2"],
            ["E", "5"],
            ["N", "6"],
          ],
        ],
        output: false,
      },
      {
        inputs: [
          ["BAA", "CAB", "DAB"],
          [
            ["A", "0"],
            ["B", "1"],
            ["C", "2"],
            ["D", "4"],
          ],
        ],
        output: false,
      },
    ],
  },
  {
    title: "removeKFromList",
    learningPath: "Linked Lists",
    suggestedTime: "15 mins",
    difficulty: "easy",
    question: `Note: Try to solve this task in O(n) time using O(1) additional space, where n is the number of elements in the list, since this is what you'll be asked to do during an interview.

    Given a singly linked list of integers l and an integer k, remove all elements from list l that have a value equal to k.`,
    example: `For l = [3, 1, 2, 3, 4, 5] and k = 3, the output should be
    solution(l, k) = [1, 2, 4, 5];
    For l = [1, 2, 3, 4, 5, 6, 7] and k = 10, the output should be
    solution(l, k) = [1, 2, 3, 4, 5, 6, 7].`,
    inputsOutputs: [
      {
        inputs: [
          {
            value: 3,
            next: {
              value: 1,
              next: {
                value: 2,
                next: {
                  value: 3,
                  next: {
                    value: 4,
                    next: {
                      value: 5,
                      next: null,
                    },
                  },
                },
              },
            },
          },
          3,
        ],
        output: {
          value: 1,
          next: {
            value: 2,
            next: {
              value: 4,
              next: {
                value: 5,
                next: null,
              },
            },
          },
        },
      },
      {
        inputs: [
          {
            value: 1000,
            next: {
              value: 1000,
              next: null,
            },
          },
          1000,
        ],
        output: null,
      },
      {
        inputs: [
          {
            value: 123,
            next: {
              value: 456,
              next: {
                value: 789,
                next: {
                  value: 0,
                  next: null,
                },
              },
            },
          },
          0,
        ],
        output: {
          value: 123,
          next: {
            value: 456,
            next: {
              value: 789,
              next: null,
            },
          },
        },
      },
    ],
  },
];

module.exports = { challengeData };
