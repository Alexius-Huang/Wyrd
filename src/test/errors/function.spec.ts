import { compile } from '../..';

describe('Error: Function', () => {
  describe('No Function Redeclaration', () => {
    it('throws error when function is redeclared', () => {
      const program = `\
def addition(x: Num, y: Num): Num => x + y
addition(1, 2)

def addition(x: Num, y: Num): Num => (x + y) * 2
addition(1, 2)
`;

      expect(() => compile({ program }))
        .toThrowError('ParserError: Overriding function `addition` with existing input pattern `Num.Num`; to override the function, address it with `override` keyword before `def` token');
    });
  });
  
  describe('No Override Function Declaration Needed', () => {
    it('throws error when function do not need any override declaration where function doesn\'t exist', () => {
      const program = `\
override def addition(x: Num, y: Num): Num => x + y
addition(1, 2)
`;
      expect(() => compile({ program }))
        .toThrowError('ParserError: Function `addition` need not to be override since no input pattern `Num.Num` declared');
    });

    it('throws error when function hasn\'t have corresponding input parameter pattern', () => {
      const program = `\
def addition(x: Num, y: Num): Num => x + y
override def addition(x: Num, y: Num, z: Num): Num => x + y + z
`;
      expect(() => compile({ program }))
        .toThrowError('ParserError: Function `addition` need not to be override since no input pattern `Num.Num.Num` declared');
    });
  });

  describe('Unmatched Output Type', () => {
    it('throws error when declared function output type isn\'t matched with the actual return value type', () => {
      const program = `\
def foo: Num => True
`;

      expect(() => compile({ program }))
        .toThrowError('ParserError: Return type of function `foo` should be `Num`, instead got: `Bool`');
    });
  });
});
