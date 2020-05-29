import { compile } from '../..';
import { Scope, DataType as DT } from '../../parser/utils';
import { CompilerOptions } from '../../types';

describe('Error: Conditional', () => {
  const compilerOptions: CompilerOptions = {
    scopeMiddleware(): Scope {
      const s = new Scope();
      s.createConstant('cond1', DT.Bool);
      s.createConstant('cond2', DT.Bool);
      s.createConstant('cond3', DT.Bool);
      return s;
    },
  };

  describe('Condition', () => {
    it('throws error if condition expression is not of type `Bool`', () => {
      const program = `\nif 123 => "Hello"\nelse => "World"`;
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect conditional expression\'s condition should return `Bool` type, instead got: `Num`');  
    });
  });

  describe('Different Branch Returns Different Values', () => {
    it('throws error when If-Else expression returns different value in each branch', () => {
      const program = `
        if   cond1 => 123
        else       => "456"
      `;
      expect(() => compile({ program, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    });

    it('throws error when If-Elif-Else expression returns different value in each branch', () => {
      const program1 = `
        if   cond1 => 123
        elif cond2 => "456"
        else       => 789
      `;
      expect(() => compile({ program: program1, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

        const program2 = `
        if   cond1 => 123
        elif cond2 => 456
        else       => "789"
      `;
      expect(() => compile({ program: program2, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    
      const program3 = `
        if   cond1 => 123
        elif cond2 => "456"
        elif cond3 => 789
        else       => 666
      `;
      expect(() => compile({ program: program3, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program4 = `
        if   cond1 => 123
        elif cond2 => 456
        elif cond3 => "789"
        else       => 666
      `;
      expect(() => compile({ program: program4, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program5 = `
        if   cond1 => 123
        elif cond2 => 456
        elif cond3 => 789
        else       => "666"
      `;
      expect(() => compile({ program: program5, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    });

    it('throws nothing when If-Elif-Without-Else expression returns different value in each branch', () => {
      const program1 = `
        if   cond1 => 123
        elif cond2 => "456"
      `;
      expect(() => compile({ program: program1, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program2 = `
        if   cond1 => 123
        elif cond2 => "456"
        elif cond3 => 789
      `;
      expect(() => compile({ program: program2, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program3 = `
        if   cond1 => 123
        elif cond2 => 456
        elif cond3 => "789"
      `;
      expect(() => compile({ program: program3, ...compilerOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    });
  });

  describe('Else-Expression', () => {
    it('throws error if else-expression isn\'t followed by either `arrow`, `then` or `do` keyword', () => {
      const program = `\nif cond1 => 123\nelse 123\n`;
      expect(() => compile({ program: program, ...compilerOptions }))
        .toThrow('Expect else condition to followed by arrow `=>`, `then` or `do` keyword');
    });
  });
});
