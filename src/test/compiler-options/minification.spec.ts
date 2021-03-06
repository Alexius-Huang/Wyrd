import * as T from '../../types'
import * as Path from 'path';
import { compile } from '../..';

function perform(name: string, sample: string) {
  const path = `../../samples/${sample}`;

  let minified: string;
  let compilerOptions: T.CompilerOptions | undefined;
  const entry = Path.join(__dirname, `../../samples/${sample}.wyrd`);
  beforeAll(async () => {
    const testCase = await import(path);
    minified = testCase.minified;
    compilerOptions = testCase.compilerOptions;
  });

  it(`minifies and compiles \`${name}\` correctly`, () => {
    const { result } = compile({ minify: true, ...compilerOptions, entry });
    expect(result).toBe(minified);
  });
}

perform.todo = function (name: string, sample?: string) {
  it.todo(`minifies and compiles \`${name}\` correctly`);
}

function todo(name: string) {
  it.todo(`minifies and compiles \`${name}\` correctly`);
}

describe('Compiler Option: Minification', () => {
  describe('Arithmetics', () => {
    perform('basic arithmetic expressions', 'arithmetics/pure-expression');
    perform('with prioritized expression', 'arithmetics/with-prioritization');
  });

  describe('Logical', () => {
    perform('pure logical expression', 'logical/pure-logics');
    perform('logical expression with prioritization', 'logical/with-prioritization');
    perform('logical comparison expression', 'logical/comparison');
  });

  describe('Assignment', () => {
    perform('constant declaration', 'assignment/constant-declaration');
    perform('assignment with arithmetic expressions', 'assignment/arithmetic-expression');
    perform('assignment with logical expressions', 'assignment/logical-expression');
    perform('assignment with method invocation', 'assignment/method-invocation');
    perform('assignment with method invocation and prioritization', 'assignment/method-invocation-with-prioritization');
    perform('mutable variable declaration & assignment', 'assignment/mutable');
    perform('mutable variable declaration & assignment with prioritization', 'assignment/mutable-with-prioritization');
    perform('maybe-types declaration', 'assignment/maybe-types-declaration');
    perform('maybe-record-types declaration', 'assignment/maybe-records');
  });

  describe('Builtin Types', () => {
    perform('primitives', 'builtin-types/primitives');

    describe('List', () => {
      perform('list literals', 'builtin-types/list/literal');
      perform('multidimensional list', 'builtin-types/list/multidimension');
      perform('list with function invocation', 'builtin-types/list/with-function-invocation');
      perform('list with prioritization expressions', 'builtin-types/list/with-prioritization');
      perform('builtin-methods invocation', 'builtin-types/list/builtin-methods');
      perform('builtin-methods invocation by type', 'builtin-types/list/builtin-methods-invoke-by-type');
    });

    describe('Record', () => {
      perform('record declaration', 'record/basic-declaration');
      perform('record maybe types value declaration', 'record/maybe-types');
      perform('multiline record declaration', 'record/multiline');
      perform('record assignment', 'record/record-assignment');
      perform('nested record', 'record/nested');
      perform('record method declaration', 'record/method-declaration');
      perform('record method overloading', 'record/method-overloading');
      perform('record method overriding', 'record/method-overriding');
    });
  });

  describe('Comment', () => {
    perform('single-line comment', 'comment/singleline-comment');
    perform('multi-line comment', 'comment/multiline-comment');
    perform('multi-line comment between expression', 'comment/multiline-in-expr');
  });

  describe('Conditional Expression', () => {
    perform('If-Arrow expression', 'conditional/if-arrow-expression');
    perform('If-Arrow complex expression', 'conditional/if-arrow-complex');
    perform('If-Arrow-Else-If complex expression', 'conditional/if-arrow-else-if-complex');
    perform('If-Arrow without Else expression', 'conditional/if-arrow-without-else-expression');
    perform('If-Then expression', 'conditional/if-then-expression');
    perform('If-Then complex expression', 'conditional/if-then-complex');
    perform('If-Then-Else-If complex expression', 'conditional/if-then-else-if-complex');
    perform('If-Then without Else expression', 'conditional/if-then-without-else-expression');
    perform('If-Block expression', 'conditional/if-else-block-expression');
    perform('If-Block complex expression', 'conditional/if-block-complex');
    perform('If-Block-Else-If complex expression', 'conditional/if-block-else-if-complex');
    perform('If-Else-If-Block expression', 'conditional/if-else-if-block-expression');
    perform('If-Block without Else expression', 'conditional/if-block-without-else-expression');
    perform('If-Else-If-Block without Else expression', 'conditional/if-else-if-block-without-else-expression');
    perform('If-Mixed expression', 'conditional/if-mixed-expression');
    perform('If-Mixed without Else expression', 'conditional/if-mixed-without-else-expression');
  });

  describe('Function Declaration', () => {
    perform('function arrow declaration', 'function-declaration/function-arrow-declaration');
    perform('function block expression declaration', 'function-declaration/function-block-declaration');
    perform('uses variables from parent scope', 'function-declaration/using-vars-from-parent-scope');
    perform('invoking other declared function', 'function-declaration/invoke-declared-function');
    perform('nested declaration', 'function-declaration/nested-declaration');
    perform('override function declaration', 'function-declaration/override-function-declaration');
    perform('function overloading', 'function-declaration/function-overloading');
    perform('override function overloading', 'function-declaration/override-function-overloading');
  });

  describe('Function Invocation', () => {
    perform('basic function invocation', 'function-invocation/basic-invocation');
    perform('nested function invocation', 'function-invocation/nested-invocation');
    perform('function invocation with prioritization', 'function-invocation/with-prioritization');
    perform('declare function before function invocation', 'function-invocation/declare-before-invoke');
  });

  describe('Method Declaration', () => {
    perform('method arrow declaration', 'method-declaration/method-arrow-declaration');
    perform('method block declaration', 'method-declaration/method-block-declaration');
    perform('method declaration overloading', 'method-declaration/method-overloading');
    perform('method declaration overriding', 'method-declaration/method-overriding');
  });

  describe('Method Invocation', () => {
    perform('method invocation with direct method mapping', 'method-invocation/direct-method-mapping');
    perform('expression invoke method expression', 'method-invocation/expr-invoke-method');
    perform('chained method invocation', 'method-invocation/chained');
    perform('method invocation as parameters', 'method-invocation/as-params');
    perform('method invocation mixed binary operation', 'method-invocation/with-binary-operation');
    perform('builtin-type method invocation', 'method-invocation/builtin-type-invocation');
  });

  describe('Pipe Operation', () => {
    perform('function invocation pipeline', 'pipe-operation/on-function');
    perform('method invocation pipeline', 'pipe-operation/on-method');
    perform('function and method invocation mixed pipeline', 'pipe-operation/on-mixed');
  });
});
