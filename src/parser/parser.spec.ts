import { parse } from './index';

describe('Wyrd Parser', () => {
  it('parses the tokens into AST', async () => {
    /* Single Case */
    // const { tokens, ast } = await import('../samples/002-arithmetics-2');
    // const result = parse(tokens);

    // for (let exprNum = 0; exprNum < result.length; exprNum++) {
    //   expect(result[exprNum]).toMatchObject(ast[exprNum]);
    // }

    /* All Cases */
    const { samples } = await import('../samples/index');

    let i = 0;
    for await (const { tokens, ast } of samples) {
      if (i === 2) break;
      const result = parse(tokens);

      for (let exprNum = 0; exprNum < result.length; exprNum++) {
        expect(result[exprNum]).toMatchObject(ast[exprNum]);
      }
      i++;
    }
  });
});
