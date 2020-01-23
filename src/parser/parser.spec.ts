import { parse } from './index';

describe('Wyrd Parser', () => {
  it('parses the tokens into AST', async () => {
    /* Single Case */
    const { tokens, ast } = await import('../samples/009-conditional-expression');
    const result = parse(tokens);
    // console.log(JSON.stringify(result[1], undefined, 2));

    for (let exprNum = 0; exprNum < result.length; exprNum++) {
      expect(result[exprNum]).toMatchObject(ast[exprNum]);
    }

    /* All Cases */
    const { samples } = await import('../samples/index');

    for await (const { tokens, ast } of samples) {
      const result = parse(tokens);

      for (let exprNum = 0; exprNum < result.length; exprNum++) {
        expect(result[exprNum]).toMatchObject(ast[exprNum]);
      }
    }
  });
});