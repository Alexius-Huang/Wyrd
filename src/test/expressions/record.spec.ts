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

  describe('Record Method', () => {
    FundamentalCompileTest('record/method-declaration');
    FundamentalCompileTest('record/method-overloading');
  });
});
