import { Token, AST } from "../src/types";

const filenames = [
  './001-arithmetics-1'
];

type Sample = {
  program: string;
  tokens: Array<Token>;
  ast: AST;
};

export const samples = filenames.map(fn => import(fn) as Promise<Sample>);
