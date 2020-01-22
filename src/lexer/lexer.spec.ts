import { lex } from './index';

describe('Wyrd Lexer', () => {
  it('lexs the code into array of tokens', async () => {
    /* Single Case */
    // const { program, tokens } = await import('../samples/008-logical-comparison');
    // const result = lex(program);
    // tokens.forEach(({ type, value }, i) => {
    //   expect(result[i].type).toBe(type);
    //   expect(result[i].value).toBe(value);
    // });

    /* All Cases */
    const { samples } = await import('../samples/index');

    for await (const { program, tokens } of samples) {
      const result = lex(program);

      tokens.forEach(({ type, value }, i) => {
        expect(result[i].type).toBe(type);
        expect(result[i].value).toBe(value);
      });
    }
  });
});
