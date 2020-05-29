import { compile } from '../..';

describe('Error: Type Literal', () => {
  describe('Lacking Type Parameter', () => {
    it('throws error when generic type lacks type parameter', () => {
      const program = 'foo = [1 2 3]\nList.push(foo, 666)';
      expect(() => compile({ program }))
        .toThrow('ParserError: Type `List` has generic type parameters `element`');
    });      
  });

  describe('Incorrect Format', () => {
    it('throws error when type literal isn\'t closed with ', () => {
      const program = 'foo = [1 2 3]\nList<Num.push(foo, 666)';
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect type parameters in generic type literal to end with token `gt`, instead got token of type `dot`');
    });
  });

  describe('Wrong Number of Type Parameters', () => {
    it('throws error when providing insufficient type parameters', () => {
      const program = 'foo = [1 2 3]\nList<>.push(foo, 666)';
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect type parameters in generic type `List` has 1 type parameter(s), instead got: 0');
    });

    it('throws error when providing too much type parameters', () => {
      const program = 'foo = [1 2 3]\nList<Num, Str>.push(foo, 666)';
      expect(() => compile({ program }))
        .toThrow('ParserError: Expect type parameters in generic type `List` has 1 type parameter(s), instead got more than 1');
    });
  });
});
