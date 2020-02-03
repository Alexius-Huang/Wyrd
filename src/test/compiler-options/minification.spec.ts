import * as T from '../../types'
import { compile } from '../..';

function perform(name, sample: string) {
  const path = `../../samples/${sample}`;

  let program: string;
  let minified: string;
  let parseOptions: T.ParseOptions | undefined;
  beforeAll(async () => {
    const testCase = await import(path);
    program = testCase.program;
    minified = testCase.minified;
    parseOptions = testCase.parseOptions;
  });

  it(`minifies and compiles \`${name}\` correctly`, () => {
    const result = compile(program, { minify: true, parseOptions });
    expect(result).toBe(minified);
  });
}

describe('Compiler Option: Minification', () => {
  describe('Arithmetics', () => {
    perform('basic arithmetic expressions', 'arithmetics/pure-expression');
  });
});
