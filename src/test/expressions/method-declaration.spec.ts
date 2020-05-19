import { FundamentalCompileTest } from '../helper';

describe('Method Declaration', () => {
  describe('Method-Arrow Declaration', () => {
    FundamentalCompileTest('method-declaration/method-arrow-declaration');
  });

  describe('Method-Block Declaration', () => {
    FundamentalCompileTest('method-declaration/method-block-declaration');
  });

  describe('Method Declaration Overloading', () => {
    FundamentalCompileTest('method-declaration/method-overloading');
  });

  describe('Method Declaration Overriding', () => {
    FundamentalCompileTest('method-declaration/method-overriding');
  });
});
