import { FundamentalCompileTest } from '../helper';

describe('Assignment Expression', () => {
  describe('Basic Assignment', () => {
    FundamentalCompileTest('assignment/basic');

    describe('Arithmetic Expression', () => {
      FundamentalCompileTest('assignment/arithmetic-expression');
    });
  
    describe('Logical Expression', () => {
      FundamentalCompileTest('assignment/logical-expression');
    });
  });

  describe('Mutable Var Declaration & Assignment', () => {
    FundamentalCompileTest('assignment/mutable');

    describe('With Prioritization', () => {
      FundamentalCompileTest('assignment/mutable-with-prioritization');
    });
  });
});
