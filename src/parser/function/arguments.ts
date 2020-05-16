import * as T from '../../types';
import { TokenTracker, DataType as DT, Scope } from '../utils';
import { ParserError } from '../error';

export function parseFunctionArguments(
  tt: TokenTracker,
  scope: Scope,
): Array<T.Argument> {
  tt.next();
  const result: Array<T.Argument> = [];

  while (true) {
    let argument: T.Argument = { ident: '', type: DT.Invalid };
    if (tt.is('ident')) {
      argument.ident = tt.value;

      tt.next();
      if (tt.isNot('colon'))
        ParserError('Expect token next to the name of the argument is colon');
      tt.next();

      if (tt.isNot('builtin-type'))
        ParserError('Expect token next to the colon of the argument declaration is data-type');
      argument.type = new DT(tt.value);
      tt.next();

      // Setting variable infos from arguments
      // TODO: Handle duplicate argument name case
      result.push(argument);
      scope.createConstant(argument.ident, argument.type);

      if (tt.is('comma')) {
        tt.next();
        continue;
      }

      if (tt.is('rparen')) {
        tt.next();
        break;
      }

      ParserError('Expect token after argument declaration to be comma or right-parenthesis');
    }
  }

  return result;
}
