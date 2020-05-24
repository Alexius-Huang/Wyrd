import { compile } from '../..';
import { Scope, DataType as DT } from '../../parser/utils';

describe('Error: Conditional', () => {
  const parseOptions = {
    scope(): Scope {
      const s = new Scope();
      s.createConstant('cond1', DT.Bool);
      s.createConstant('cond2', DT.Bool);
      s.createConstant('cond3', DT.Bool);
      return s;
    },
  };

  describe('Different Branch Returns Different Values', () => {
    it('throws error when If-Else expression returns different value in each branch', () => {
      const program = `
        if   cond1 => 123
        else       => "456"
      `;
      expect(() => compile(program, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    });

    it('throws error when If-Elif-Else expression returns different value in each branch', () => {
      const program1 = `
        if   cond1 => 123
        elif cond2 => "456"
        else       => 789
      `;
      expect(() => compile(program1, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

        const program2 = `
        if   cond1 => 123
        elif cond2 => 456
        else       => "789"
      `;
      expect(() => compile(program2, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    
      const program3 = `
        if   cond1 => 123
        elif cond2 => "456"
        elif cond3 => 789
        else       => 666
      `;
      expect(() => compile(program3, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program4 = `
        if   cond1 => 123
        elif cond2 => 456
        elif cond3 => "789"
        else       => 666
      `;
      expect(() => compile(program4, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program5 = `
        if   cond1 => 123
        elif cond2 => 456
        elif cond3 => 789
        else       => "666"
      `;
      expect(() => compile(program5, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    });

    it('throws nothing when If-Elif-Without-Else expression returns different value in each branch', () => {
      const program1 = `
        if   cond1 => 123
        elif cond2 => "456"
      `;
      expect(() => compile(program1, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program2 = `
        if   cond1 => 123
        elif cond2 => "456"
        elif cond3 => 789
      `;
      expect(() => compile(program2, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');

      const program3 = `
        if   cond1 => 123
        elif cond2 => 456
        elif cond3 => "789"
      `;
      expect(() => compile(program3, { parseOptions }))
        .toThrow('ParserError: Expect values returned from different condition branch to be the same');
    });
  });
});
