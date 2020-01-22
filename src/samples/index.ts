import { Token, AST } from '../types';

const filenames = [
  './001-arithmetics-1',
  './002-arithmetics-2',
  './003-assignment',
  './004-function-expr-declaration',
  './005-function-block-declaration',
  './006-builtin-primitives',
  './007-logical-expression',
  './008-logical-comparison',
];

type Sample = {
  program: string;
  tokens: Array<Token>;
  ast: AST;
  compiled: string;
};

export const samples = filenames.map(fn => import(fn) as Promise<Sample>);
