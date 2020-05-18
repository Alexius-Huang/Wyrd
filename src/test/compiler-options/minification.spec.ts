import * as T from '../../types'
import { compile } from '../..';

function perform(name: string, sample: string) {
  const path = `../../samples/${sample}`;

  let program: string;
  let minified: string;
  let parseOptions: T.ParseOptions | undefined;
  beforeAll(async () => {
    const testCase = await import(path);
    program = testCase.program;
    minified = testCase.minified;
    parseOptions = testCase.parseOptions;
  });

  it(`minifies and compiles \`${name}\` correctly`, () => {
    const result = compile(program, { minify: true, parseOptions });
    expect(result).toBe(minified);
  });
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
    perform('basic assignment', 'assignment/basic');
    perform('assignment with arithmetic expressions', 'assignment/arithmetic-expression');
    perform('assignment with logical expressions', 'assignment/logical-expression');
    perform('mutable variable declaration & assignment', 'assignment/mutable');
    perform('mutable variable declaration & assignment with prioritization', 'assignment/mutable-with-prioritization');
  });

  describe('Builtin Types', () => {
    perform('primitives', 'builtin-types/primitives');

    describe('List', () => {
      perform('list literals', 'builtin-types/list/literal');
      perform('multidimensional list', 'builtin-types/list/multidimension');
      perform('list with function invocation', 'builtin-types/list/with-function-invocation');
      perform('list with prioritization expressions', 'builtin-types/list/with-prioritization');
    });
  });

  describe('Comment', () => {
    perform('single-line comment', 'comment/singleline-comment');
    perform('multi-line comment', 'comment/multiline-comment');
    perform('multi-line comment between expression', 'comment/multiline-in-expr');
  });

  describe('Conditional Expression', () => {
    perform('If-Arrow expression', 'conditional/if-arrow-expression');
    perform('If-Then expression', 'conditional/if-then-expression');
    perform('If-Mixed expression', 'conditional/if-mixed-expression');
    perform('If-Without-Else expression', 'conditional/if-without-else-expression');
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

  describe('Method Invocation', () => {
    perform('method invocation with direct method mapping', 'method-invocation/direct-method-mapping');
    perform('expression invoke method expression', 'method-invocation/expr-invoke-method');
    perform('chained method invocation', 'method-invocation/chained');
    perform('method invocation as parameters', 'method-invocation/as-params');
    perform('builtin-type method invocation', 'method-invocation/builtin-type-invocation');
  });
});
