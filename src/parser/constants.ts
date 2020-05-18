import * as T from '../types';
import { DataType as DT, BinaryOperator } from './utils';

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
