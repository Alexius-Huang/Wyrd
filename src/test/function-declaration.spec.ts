import { FundamentalCompileTest } from './helper';

describe('Function Declaration', () => {
  describe('Function-Arrow Declaration', () => {
    FundamentalCompileTest('function-declaration/function-arrow-declaration');
  });

  describe('Function-Block Declaration', () => {
    FundamentalCompileTest('function-declaration/function-block-declaration');
  });
});
