import { compile } from '../..';

describe('Error: Assignment', () => {
  describe('Reassignment', () => {
    it('throws error when reassigning new value to a constant', () => {
      const program = `\nfoo = 123\nfoo = 456\n`;

      expect(() => compile(program))
        .toThrow('ParserError: Constant `foo` cannot be reassigned');      
    });
  });

  describe('Mutable Variable Invalid Type Assignment', () => {
    it('throws error when assign with wrong type of value', () => {
      const program = `\nmutable foo = 123\nfoo = "Hello world"\n`;

      expect(() => compile(program))
        .toThrow('ParserError: Expect mutable variable `foo` to assign value of type `Num`, instead got: `Str`');
    });
  });

  describe('Mutable Variable Redeclaration', () => {
    it('throws error when constant redeclaring as mutable variable', () => {
      const program = `\nfoo = 123\nmutable foo = 456`;

      expect(() => compile(program))
        .toThrow('ParserError: Constant `foo` cannot be redeclared as variable');
    });

    it('throws error when mutable variable redeclaring as mutable variable again', () => {
      const program = `\nmutable foo = 123\nmutable foo = 456`;

      expect(() => compile(program))
        .toThrow('ParserError: Variable `foo` cannot be redeclared again');
    });
  });
});
