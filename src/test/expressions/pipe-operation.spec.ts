import { FundamentalCompileTest } from '../helper';

describe('Pipe Operation', () => {
  describe('Function Invocation Piping', () => {
    FundamentalCompileTest('pipe-operation/on-function');
  });

  describe.skip('Method Invocation Piping', () => {
    FundamentalCompileTest('pipe-operation/on-method');
  });
});
