import { Token } from "../src/types";

const filenames = [
  './001-arithmetics-1'
];

type Sample = {
  program: string;
  tokens: Array<Token>;
};

export const samples = filenames.map(fn => import(fn) as Promise<Sample>);
