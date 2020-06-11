import { compile } from '../..';

describe('Error: Assignment', () => {
  describe('Redeclaration', () => {
    it('throws error when reassigning new value to a constant', () => {
      const program = `Num foo = 123\nNum foo = 456\n`;

      expect(() => compile({ program }))
        .toThrow('ParserError: `foo` has already been declared as a constant');
    });

    it('throws error when reassigning new value to a variable', () => {
      const program = `mutable Num foo = 123\nNum foo = 456\n`;

      expect(() => compile({ program }))
        .toThrow('ParserError: `foo` has already been declared as a variable');
    });
  });

  describe('Mutable Variable Invalid Type Assignment', () => {
    it('throws error when assign with wrong type of value', () => {
      const program = `mutable Num foo = 123\nfoo = "Hello world"\n`;

      expect(() => compile({ program }))
        .toThrow('ParserError: Expect mutable variable `foo` to assign value of type `Num`, instead got: `Str`');
    });
  });

  describe('Mutable Variable Redeclaration', () => {
    it('throws error when constant redeclaring as mutable variable', () => {
      const program = `Num foo = 123\nmutable Num foo = 456`;

      expect(() => compile({ program }))
        .toThrow('ParserError: Constant `foo` cannot be redeclared as variable');
    });

    it('throws error when mutable variable redeclaring as mutable variable again', () => {
      const program = `mutable Num foo = 123\nmutable Num foo = 456`;

      expect(() => compile({ program }))
        .toThrow('ParserError: Variable `foo` cannot be redeclared again');
    });
  });

  describe('Maybe-Types Declaration and Assignment', () => {
    it('throws error when maybe-types variable assigned to absolute types variable', () => {
      const program = '\nmutable maybe Num foo = 123\nmutable Num bar = 456\nbar = foo';

      expect(() => compile({ program }))
        .toThrow('ParserError: Expect mutable variable `bar` to assign value of type `Num`, instead got: `maybe Num`');
    });

    it('throws error when maybe-types assigned with invalid type', () => {
      const program = `mutable maybe Num foo = "Hello world"`;

      expect(() => compile({ program }))
        .toThrow('ParserError: Expect variable `foo` to assigned with type `maybe Num`, instead got: `Str`');
    });
  });

  describe('No Variable Name', () => {
    it('throws error when mutable variable declaration lacks variable name', () => {
      const program = 'mutable Num = 123';
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect to declare mutable variable\'s name, instead got token of type: `eq`');
    });

    it('throws error when type of the mutable variable declaration is unrecognized', () => {
      const program1 = 'mutable 123 foo = 123';
      expect(() => compile({ program: program1 }))
        .toThrow('ParserError: Expect to type literal in mutable variable declaration, instead got token of type: `number`');

      const program2 = 'mutable NonExistedType foo = 123';
      expect(() => compile({ program: program2 }))
        .toThrow('ParserError: Unrecognized type: `NonExistedType`');
    });
  });
});
