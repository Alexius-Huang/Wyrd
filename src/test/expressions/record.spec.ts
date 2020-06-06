import { FundamentalCompileTest } from '../helper';

describe('Record', () => {
  describe('Declaration', () => {
    FundamentalCompileTest('record/basic-declaration');
    FundamentalCompileTest('record/multiline');
    FundamentalCompileTest('record/nested');
  });

  describe('Assignment', () => {
    FundamentalCompileTest('record/record-assignment');
  });
});
