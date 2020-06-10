import { compile } from '../..';

describe('Used Unidentified Token', () => {
  it('throws error when using unidentified token', () => {
    const program1 = `\nNum foo = 1 + bar\n`;
    expect(() => compile({ program: program1 }))
      .toThrowError('ParserError: Using the unidentified token `bar`');

    const program2 = `\nNum foo = 1 + (bar * 2)`;
    expect(() => compile({ program: program2 }))
      .toThrowError('ParserError: Using the unidentified token `bar`');
  });

  it('throws error when invoking undeclared function', () => {
    const program = `\nfoo(123)`;
    expect(() => compile({ program }))
      .toThrowError('ParserError: Using the unidentified token `foo`');
  });
});
