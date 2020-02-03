import { FundamentalCompileTest } from '../helper';

describe('Comment', () => {
  describe('Singleline Comment', () => {
    FundamentalCompileTest('comment/singleline-comment');    
  });

  describe('Multiline Comment', () => {
    FundamentalCompileTest('comment/multiline-comment');

    describe('Multiline in Expression', () => {
      FundamentalCompileTest('comment/multiline-in-expr');
    });
  });
});
