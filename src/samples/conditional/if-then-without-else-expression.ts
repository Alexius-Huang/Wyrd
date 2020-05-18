import { Token, AST, Operator as Op, ParseOptions } from '../../types';
import { NumberLiteral, StringLiteral, Var } from '../helper';
import { DataType as DT, Scope } from '../../parser/utils';
import { EmptyExpression } from '../../parser/constants';

const program = `\
if age < 18 then
  "youngster"
end
`;

const tokens: Array<Token> = [
  { type: 'keyword', value: 'if' },
  { type: 'ident', value: 'age' },
  { type: 'lt', value: '<' },
  { type: 'number', value: '18' },
  { type: 'keyword', value: 'then' },
  { type: 'newline', value: '\n' },
  { type: 'string', value: 'youngster' },
  { type: 'newline', value: '\n' },
  { type: 'keyword', value: 'end'},
  { type: 'newline', value: '\n' }
];

const ast: AST = [
  {
    type: 'ConditionalExpr',
    return: DT.Maybe.Str,
    condition: {
      type: 'BinaryOpExpr',
      operator: Op.Lt,
      return: DT.Bool,
      expr1: Var('age', DT.Num),
      expr2: NumberLiteral(18),
    },
    expr1: StringLiteral('youngster'),
    expr2: EmptyExpression,
  },
];

const compiled = `\
age < 18 ? 'youngster' : null;
`;

const minified = "age<18?'youngster':null;";

const scope = () => {
  const result = new Scope();
  result.createConstant('age', DT.Num);

  return result;
};

const parseOptions: ParseOptions = { scope };

export {
  program,
  tokens,
  ast,
  compiled,
  parseOptions,
  minified,
};
