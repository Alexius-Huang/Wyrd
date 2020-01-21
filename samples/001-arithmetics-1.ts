import { Token } from "../src/types";

const program = `\
1 + 2
`;

const tokens: Array<Token> = [
  { type: 'number', value: '1' },
  { type: 'plus', value: '+' },
  { type: 'number', value: '2' },
  { type: 'newline', value: '\n' },
];

export {
  program,
  tokens,
};
