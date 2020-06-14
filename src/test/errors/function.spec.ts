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

  describe('No Argument Declaration', () => {
    it('throws error when no argument is declared with empty parentheses exist', () => {
      const program = `def hello(): Str => "World"\n`;
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect function `hello` must declare at least one argument if parentheses exists, else remove the parenthese if no argument declared');
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

  describe('Misuse Keyword', () => {
    it('throws error if `def` keyword is not used with token which represents function or method name', () => {
      const program = 'def 123';
      expect(() => compile({ program }))
        .toThrowError('ParserError: Unhandled token of type `number` when ready to parse function or method declaration');
    });

    it('throws error if `override` keyword is not used with `def` keyword', () => {
      const program = 'override 123';
      expect(() => compile({ program }))
        .toThrowError('ParserError: Keyword `override` should used with `def` to override an existing function declaration, instead got token of type `number`');
    });
  });
});
