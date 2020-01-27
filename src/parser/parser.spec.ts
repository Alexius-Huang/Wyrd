import { parse } from './index';

describe('Wyrd Parser', () => {
  it('parses the tokens into AST', async () => {
    /* Single Case */
    // const { tokens, ast/*, parseOptions*/ } = await import('../samples/005-function-block-declaration');
    // const result = parse(tokens, /*parseOptions*/);

    // for (let exprNum = 0; exprNum < result.length; exprNum++) {
    //   expect(result[exprNum]).toMatchObject(ast[exprNum]);
    // }

    /* All Cases */
    const { samples } = await import('../samples/index');

    for await (const { tokens, ast, parseOptions } of samples) {
      const result = parse(tokens, parseOptions);

      for (let exprNum = 0; exprNum < result.length; exprNum++) {
        expect(result[exprNum]).toMatchObject(ast[exprNum]);
      }
    }
  });
});
