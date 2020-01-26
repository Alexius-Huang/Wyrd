import { parse } from './index';

describe('Wyrd Parser', () => {
  it('parses the tokens into AST', async () => {
    /* Single Case */
    const { tokens, ast } = await import('../samples/001-arithmetics-1');
    const result = parse(tokens);

    for (let exprNum = 0; exprNum < result.length; exprNum++) {
      expect(result[exprNum]).toMatchObject(ast[exprNum]);
    }

    /* All Cases */
    // const { samples } = await import('../samples/index');

    // for await (const { tokens, ast } of samples) {
    //   const result = parse(tokens);

    //   for (let exprNum = 0; exprNum < result.length; exprNum++) {
    //     expect(result[exprNum]).toMatchObject(ast[exprNum]);
    //   }
    // }
  });
});
