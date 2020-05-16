import { compile } from '../..';

describe('No Function Redeclaration', () => {
  it('throws error when function is redeclared', () => {
    const program = `
def addition(x: Num, y: Num): Num => x + y
addition(1, 2)

def addition(x: Num, y: Num): Num => (x + y) * 2
addition(1, 2)
`;

    expect(() => compile(program))
      .toThrowError('ParserError: Overriding function `addition` with existing input pattern `Num.Num`; to override the function, address it with `override` keyword before `def` token');
  });
});
