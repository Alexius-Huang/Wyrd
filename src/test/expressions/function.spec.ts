import { FundamentalCompileTest } from '../helper';

describe('Functions', () => {
  describe('Function Declaration', () => {
    describe('Function-Arrow Declaration', () => {
      FundamentalCompileTest('function-declaration/function-arrow-declaration');
    });
  
    describe('Function-Block Declaration', () => {
      FundamentalCompileTest('function-declaration/function-block-declaration');
    });

    describe('Function Declaration Using Variables in Parent Level Scope', () => {
      FundamentalCompileTest('function-declaration/using-vars-from-parent-scope');
    });

    describe('Invoking Other Declared Function', () => {
      FundamentalCompileTest('function-declaration/invoke-declared-function');
    });

    describe('Nested Function Declaration', () => {
      FundamentalCompileTest('function-declaration/nested-declaration');
    });

    describe('Function Overloading', () => {
      FundamentalCompileTest('function-declaration/function-overloading');
    });

    describe('Override Function Declaration', () => {
      FundamentalCompileTest('function-declaration/override-function-declaration');

      describe('With Function Overloading', () => {
        FundamentalCompileTest('function-declaration/override-function-overloading');
      });
    });
  });
  
  describe('Function Invocation', () => {
    describe('Basic Invocation', () => {
      FundamentalCompileTest('function-invocation/basic-invocation');
    });
  
    describe('Nested Invocation', () => {
      FundamentalCompileTest('function-invocation/nested-invocation');
    });
  
    describe('With Prioritization', () => {
      FundamentalCompileTest('function-invocation/with-prioritization');
    });

    describe('With Method Invocation', () => {
      FundamentalCompileTest('function-invocation/with-method-invocation');
    });

    describe('Declare Before Invocation', () => {
      FundamentalCompileTest('function-invocation/declare-before-invoke');
    });
  });
});
