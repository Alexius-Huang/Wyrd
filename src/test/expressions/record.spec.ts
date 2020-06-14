import { FundamentalCompileTest } from '../helper';

describe('Record', () => {
  describe('Declaration', () => {
    FundamentalCompileTest('record/basic-declaration');
    FundamentalCompileTest('record/multiline');
    FundamentalCompileTest('record/nested');
    FundamentalCompileTest('record/maybe-types');
  });

  describe('Assignment', () => {
    FundamentalCompileTest('record/record-assignment');
  });

  describe('Method Declaration', () => {
    FundamentalCompileTest('record/method-declaration');
  });
});
