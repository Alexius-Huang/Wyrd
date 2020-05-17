import { FundamentalCompileTest } from '../helper';
import { compile } from '../..';

describe('Assignment Expression', () => {
  describe('Basic Assignment', () => {
    FundamentalCompileTest('assignment/basic');

    describe('Arithmetic Expression', () => {
      FundamentalCompileTest('assignment/arithmetic-expression');
    });
  
    describe('Logical Expression', () => {
      FundamentalCompileTest('assignment/logical-expression');
    });

    describe('Reassignment', () => {
      it('Throws error when reassigning new value to a constant', () => {
        const program = `\nfoo = 123\nfoo = 456\n`;
  
        expect(() => compile(program))
          .toThrow('ParserError: Constant `foo` cannot be reassigned');      
      });
    });
  });

  describe('Mutable Var Declaration & Assignment', () => {
    FundamentalCompileTest('assignment/mutable');

    describe('With Prioritization', () => {
      FundamentalCompileTest('assignment/mutable-with-prioritization');
    });

    it('throws error when assign with wrong type of value', () => {
      const program = `\nmutable foo = 123\nfoo = "Hello world"\n`;

      expect(() => compile(program))
        .toThrow('ParserError: Expect mutable variable `foo` to assign value of type `Num`, instead got: `Str`');
    });
  });
});
