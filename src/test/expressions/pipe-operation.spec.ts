import { FundamentalCompileTest } from '../helper';

describe('Pipe Operation', () => {
  describe('Function Invocation Piping', () => {
    FundamentalCompileTest('pipe-operation/on-function');
  });

  describe('Method Invocation Piping', () => {
    FundamentalCompileTest('pipe-operation/on-method');
  });

  describe('Mixed Function and Method Invocation Piping', () => {
    FundamentalCompileTest('pipe-operation/on-mixed');
  });
});
