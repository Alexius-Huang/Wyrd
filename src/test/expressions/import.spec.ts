import { FundamentalCompileTest } from '../helper';

describe('Import Expression', () => {
  describe('Importing Wyrd Program', () => {
    FundamentalCompileTest('import-mechanism/import-wyrd-program');
  });

  describe('Importing Library', () => {
    FundamentalCompileTest('import-mechanism/import-builtin-lib');
    FundamentalCompileTest('import-mechanism/import-user-defined-lib');
  });

  describe('Compiler Option: mainFileOnly', () => {
    FundamentalCompileTest('import-mechanism/compile-main-file-only');
  });
});
