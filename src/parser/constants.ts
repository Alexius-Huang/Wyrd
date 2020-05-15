import * as T from '../types';
import { DataType as DT, BinaryOperator, Parameter } from './classes';

export const Primitives = new Set(['Num', 'Str', 'Bool']);
export const EmptyExpression: T.EmptyExpr = { type: 'EmptyExpr', return: DT.Invalid };

export const BuiltinBinaryOperators = new Set<string>([
  '+',
  '-',
  '*',
  '/',
  '%',
  '>',
  '<',
  '>=',
  '<=',
  '==',
  '!=',
]);

export const LogicalBinaryOperators = new Set<string>([
  '>',
  '<',
  '>=',
  '<=',
  '==',
  '!='
]);

const arithmeticOperation: T.Operand = { left: DT.Num, right: DT.Num, return:DT.Num }
const plusOperation = new BinaryOperator('+');
const minusOperation = new BinaryOperator('-');
const multiplyOperation = new BinaryOperator('*');
const divideOperation = new BinaryOperator('/');
const modularOperation = new BinaryOperator('%');
[plusOperation, minusOperation, multiplyOperation, divideOperation].forEach(op => {
  op.newOperation(arithmeticOperation);
});

const logicalOperations: T.Operand[] = [
  { left: DT.Num, right: DT.Num, return: DT.Bool },
  { left: DT.Str, right: DT.Str, return: DT.Bool },
  { left: DT.Bool, right: DT.Bool, return: DT.Bool },
  { left: DT.Null, right: DT.Null, return: DT.Bool },
];
const equalOperation = new BinaryOperator('==');
const inequalOperation = new BinaryOperator('!=');
const gtOperation = new BinaryOperator('>');
const ltOperation = new BinaryOperator('<');
const gteOperation = new BinaryOperator('>=');
const lteOperation = new BinaryOperator('<=');
[equalOperation, inequalOperation, gtOperation, ltOperation, gteOperation, lteOperation].forEach(op => {
  op.newOperations(logicalOperations);
});

export const BuiltinOPActions = new Map<string, BinaryOperator>([
  ['+', plusOperation],
  ['-', minusOperation],
  ['*', multiplyOperation],
  ['/', divideOperation],
  ['%', modularOperation],
  ['==', equalOperation],
  ['!=', inequalOperation],
  ['>', gtOperation],
  ['<', ltOperation],
  ['>=', gteOperation],
  ['<=', lteOperation],
]);

export const BuiltinStrMethods = new Map<string, T.MethodPattern>([
  ['upcase',   { name: 'upcase',   parameter: Parameter.Void(),             return: DT.Str }],
  ['downcase', { name: 'downcase', parameter: Parameter.Void(),             return: DT.Str }],
  ['repeat',   { name: 'repeat',   parameter: Parameter.of(DT.Num),         return: DT.Str }],
  ['toStr',    { name: 'toStr',    parameter: Parameter.Void(),             return: DT.Str }],
  ['at',       { name: 'at',       parameter: Parameter.of(DT.Num),         return: DT.Str }],
  ['concat',   { name: 'concat',   parameter: Parameter.of(DT.Str),         return: DT.Str }],
  ['indexOf',  { name: 'indexOf',  parameter: Parameter.of(DT.Str),         return: DT.Num }],
  ['split',    { name: 'split',    parameter: Parameter.of(DT.Str),         return: DT.ListOf(DT.Str) }],
  ['rest',     { name: 'rest',     parameter: Parameter.of(DT.Num),         return: DT.Str }],
  ['between',  { name: 'between',  parameter: Parameter.of(DT.Num, DT.Num), return: DT.Str }],
]);

export const BuiltinNumMethods = new Map<string, T.MethodPattern>([
  ['toStr', { name: 'toStr', parameter: Parameter.Void(), return: DT.Str }],
]);

export const BuiltinBoolMethods = new Map<string, T.MethodPattern>([
  ['toStr', { name: 'toStr', parameter: Parameter.Void(), return: DT.Str }],
])

export const BuiltinPrimitiveMethods = new Map([
  ['Str', BuiltinStrMethods],
  ['Num', BuiltinNumMethods],
  ['Bool', BuiltinBoolMethods],
]);
