import { compile } from '../..';

describe.only('Used Unidentified Token', () => {
  it('throws error when using unidentified token', () => {
    const program1 = `\nfoo = 1 + bar\n`;
    expect(() => compile(program1))
      .toThrowError('ParserError: Using the unidentified token `bar`');

    const program2 = `\nfoo = 1 + (bar * 2)`;
    expect(() => compile(program2))
      .toThrowError('ParserError: Using the unidentified token `bar`');
  });
});
