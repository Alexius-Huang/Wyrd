import { FundamentalCompileTest } from '../helper';

describe('Assignment Expressions', () => {
  describe('Basic Assignment', () => {
    FundamentalCompileTest('assignment/basic');

    describe('Arithmetic Expression', () => {
      FundamentalCompileTest('assignment/arithmetic-expression');
    });
  
    describe('Logical Expression', () => {
      FundamentalCompileTest('assignment/logical-expression');
    });

    describe('Method Invocation Expression', () => {
      FundamentalCompileTest('assignment/method-invocation');
      FundamentalCompileTest('assignment/method-invocation-with-prioritization');
    });
  });

  describe('Mutable Var Declaration & Assignment', () => {
    FundamentalCompileTest('assignment/mutable');

    describe('With Prioritization', () => {
      FundamentalCompileTest('assignment/mutable-with-prioritization');
    });

    describe('As Maybe Types', () => {
      FundamentalCompileTest('assignment/maybe-types-declaration');
      FundamentalCompileTest('assignment/maybe-records');
    });
  });
});
