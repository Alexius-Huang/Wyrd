import * as T from '../../types';
import { TokenTracker, Scope, DataType as DT, ScopeRecord as Record } from '../utils';
import { VoidExpression } from '../constants';
import { ParserError } from '../error';

export function parseRecordDeclaration(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
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
  parseRecordDefinition(tt, parseExpr, scope, record);

  return VoidExpression;
}

function parseRecordDefinition(
  tt: TokenTracker,
  parseExpr: T.ExpressionParsingFunction,
  scope: Scope,
  record: Record,
): Record {
  if (tt.is('rcurly'))
    ParserError(`Expect record declaration \`${record.name}\` is not blank`);

  while (true) {
    tt.skipNewlines();
    if (tt.is('rcurly'))
      ParserError('Expect to declare new property-value pair, instead got token of typr `rcurly`');

    if (tt.is('ident')) {
      if (!scope.hasRecord(tt.value))
        ParserError(`Unidentified token of value \`${tt.value}\``);
    }
    else if (tt.isNot('builtin-type'))
      ParserError(`Expect record \`${record.name}\` to declare the type of the property first, instead got token of type \`${tt.type}\``);

    const t = new DT(tt.value);
    tt.next(); // Skip `type` or `ident` declaration

    if (tt.isNot('ident'))
      ParserError(`Expect record \`${record.name}\` to declare the name of the property after type declaration, instead got token of type \`${tt.type}\``);
    const v = tt.value;
    tt.next(); // Skip `ident`

    record.setProperty(t, v);

    if (tt.isNot('comma')) {
      tt.skipNewlines();
      if (tt.is('rcurly')) break;
      ParserError(`Expect more definition of record \`${record.name}\` to dilimited by comma, instead got token of type \`${tt.type}\``);
    }
    tt.next(); // Skip comma
  }

  return record;
}
