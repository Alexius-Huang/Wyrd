import { parse } from './index';

describe('Wyrd Parser', () => {
  it('parses the tokens into AST', async () => {
    /* Single Case */
    const { tokens, ast, parseOptions } = await import('../samples/009-conditional-expression');
    const result = parse(tokens, parseOptions);
    console.log(JSON.stringify(result, undefined, 2));

    for (let exprNum = 0; exprNum < result.length; exprNum++) {
      expect(result[exprNum]).toMatchObject(ast[exprNum]);
    }

    /* All Cases */
    const { samples } = await import('../samples/index');

    let i = 0;
    for await (const { tokens, ast } of samples) {
      if (i === 3) break;
      const result = parse(tokens);

      for (let exprNum = 0; exprNum < result.length; exprNum++) {
        expect(result[exprNum]).toMatchObject(ast[exprNum]);
      }
      i++;
    }
  });
});
