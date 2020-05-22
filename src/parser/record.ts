import * as T from '../types';
import { TokenTracker, Scope, DataType as DT, ScopeRecord as Record } from './utils';
import { VoidExpression, EmptyExpression } from './constants';
import { ParserError } from './error';

export function parseRecordDeclaration(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
): T.VoidExpr {
  tt.next(); // Skip the `record` keyword

  if (tt.isNot('ident'))
    ParserError(`Expect to give the name of the record, instead got token of type: \`${tt.type}\``);

  const name = tt.value;
  if (scope.canBeNamedAs(name))
    ParserError(`Cannot declare record \`${name}\`, since the name has already been used`);
  tt.next(); // Skip `ident`

  if (tt.isNot('lcurly'))
    ParserError(`Expect token of type \`lcurly\`, instead got: \`${tt.type}\``);
  tt.next(); // Skip `{`

  const record = scope.createRecord(name);
  parseRecordDefinition(tt, parseExpr, record);

  return VoidExpression;
}

function parseRecordDefinition(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  record: Record,
): Record {
  if (tt.is('rcurly'))
    ParserError(`Expect record declaration \`${record.name}\` is not blank`);

  while (true) {
    // TODO: Support type other than builtin-type
    if (tt.isNot('builtin-type'))
      ParserError(`Expect record \`${record.name}\` to declare the type of the property first, instead got token of type \`${tt.type}\``);
    const t = new DT(tt.value);
    tt.next(); // Skip `type` declaration

    if (tt.isNot('ident'))
      ParserError(`Expect record \`${record.name}\` to declare the name of the property after type declaration, instead got token of type \`${tt.type}\``);
    const v = tt.value;
    tt.next(); // Skip `ident`

    record.setProperty(t, v);

    if (tt.isNot('comma')) {
      if (tt.is('rcurly')) break;
      ParserError(`Expect more definition of record \`${record.name}\` to dilimited by comma, instead got token of type \`${tt.type}\``);
    }
    tt.next(); // Skip comma
  }

  return record;
}

export function parseRecordLiteral(
  tt: TokenTracker,
  parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
  scope: Scope,
  prevExpr?: T.Expr,
): T.RecordExpr {
  const recordName = tt.value;
  tt.next(); // Skip `ident`

  const result: T.RecordExpr = {
    type: 'RecordExpr',
    properties: [],
    return: new DT(recordName),
  };

  if (tt.isNot('lcurly'))
    ParserError(`Expect left curly brace after record type, instead got token of type \`${tt.type}\``);
  tt.next(); // Skip `{`

  const recordDef = scope.getRecord(recordName);
  const requiredPropertySet = new Set(recordDef.propertySet);
  while (true) {
    if (tt.isNot('ident'))
      ParserError(`Expect to have property name of record \`${recordName}\`, instead got token of type \`${tt.type}\``);
    const propName = tt.value;
    tt.next(); // Skip `ident`

    if (tt.isNot('colon'))
      ParserError(`Expect key-value pairs of record \`${recordName}\` to dilimited by \`colon\`, instead got token of type \`${tt.type}\``);
    tt.next(); // Skip `colon`

    if (requiredPropertySet.has(propName)) {
      requiredPropertySet.delete(propName);
      const propDef = recordDef.getProperty(propName);
      const propValue: T.RecordPropertyValue = {
        name: propName,
        type: propDef?.type,
        value: EmptyExpression,
      };

      let propValueExpr: T.Expr = EmptyExpression;
      while (true) {
        propValueExpr = parseExpr();
        tt.next();
        if (tt.is('comma') || tt.is('rcurly')) break;
      }

      propValue.value = propValueExpr;
      result.properties.push(propValue);
    } else {
      ParserError(`Property \`${propName}\` isn't exist in definition of record \`${recordName}\``);
    }

    if (tt.isNot('comma')) {
      if (tt.is('rcurly')) break;
      ParserError(`Expect more key-value pairs of record \`${recordName}\` to dilimited by comma, instead got token of type \`${tt.type}\``);
    }
    tt.next(); // Skip comma
  }

  if (requiredPropertySet.size !== 0) {
    const formattedStr = Array.from(requiredPropertySet).map(v => `\`${v}\``).join(', ')
    ParserError(`Property of record \`${recordName}\` is missing: ${formattedStr}`);
  }

  return result;
}

// function parseRecordLiteralStructure(
//   tt: TokenTracker,
//   parseExpr: (prevExpr?: T.Expr, meta?: any) => T.Expr,
//   scope: Scope,
//   prevExpr?: T.Expr,
// ) {

// }
