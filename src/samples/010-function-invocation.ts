import { Token, AST, Operator as Op } from '../types';

const program = `\
`;

// TODO:
`\
print "Hello"
addition 2, 3

print("Hello")
addition(2, 3)

funcA 1, 2, funcB 3, 4, 5
funcA 1, 2, (funcB 3, 4), 5
funcA 1, 2, funcB(3, 4), 5
`

const tokens: Array<Token> = [];

const ast: AST = [];

const compiled = `\
`;

// TODO:
`\
print('Hello');
addition(2, 3);
print('Hello');
addition(2, 3);
funcA(1, 2, funcB(3, 4, 5));
funcA(1, 2, funcB(3, 4), 5);
funcA(1, 2, funcB(3, 4), 5);
`

export {
  program,
  tokens,
  ast,
  compiled,
};
