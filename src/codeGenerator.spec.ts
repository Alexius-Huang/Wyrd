import { generateCode } from './codeGenerator';

describe('Wyrd Code Generator', () => {
  it('generates compiled JavaScript code from parsed AST', async () => {
    /* Single Case */
    // const { ast, compiled } = await import('../samples/005-function-block-declaration');
    // const result = generateCode(ast);
    // expect(result).toBe(compiled);

    /* All Cases */
    const { samples } = await import('./samples/index');

    for await (const { ast, compiled } of samples) {
      const result = generateCode(ast);
      expect(result).toBe(compiled);
    }
  });
});
