import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT } from '../utils';
import { EmptyExpression } from '../constants';
import { ParserError } from '../error';

export function parseRecordLiteral(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  prevExpr?: T.Expr,
): T.RecordLiteral {
  const recordName = tt.value;
  tt.next(); // Skip `ident`

  const result: T.RecordLiteral = {
    type: 'RecordLiteral',
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
        type: propDef.type,
        value: EmptyExpression,
      };

      let propValueExpr: T.Expr = EmptyExpression;
      while (true) {
        propValueExpr = parseExpr();
        tt.next();
        if (tt.is('comma') || tt.is('rcurly')) break;
      }

      if (propValueExpr.return.isNotEqualTo(propValue.type))
        ParserError(`Expect property \`${propName}\` in record \`${recordDef.name}\` to receive value of type \`${propDef.type}\`, instead got value of type \`${propValueExpr.return}\``);

      propValue.value = propValueExpr;
      result.properties.push(propValue);
    } else {
      ParserError(`Property \`${propName}\` isn't exist in definition of record \`${recordName}\``);
    }

    if (tt.isNot('comma') && tt.is('rcurly')) break;
    tt.next(); // Skip comma
  }

  if (requiredPropertySet.size !== 0) {
    const formattedStr = Array.from(requiredPropertySet).map(v => `\`${v}\``).join(', ')
    ParserError(`Property of record \`${recordName}\` is missing: ${formattedStr}`);
  }

  return result;
}
