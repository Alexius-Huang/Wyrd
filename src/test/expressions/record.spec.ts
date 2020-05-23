import { FundamentalCompileTest } from '../helper';

describe('Record', () => {
  describe('Declaration', () => {
    FundamentalCompileTest('record/basic-declaration');
  });

  describe('Assignment', () => {
    FundamentalCompileTest('record/record-assignment');
  });
});
