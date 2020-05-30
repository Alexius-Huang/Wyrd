import { Token } from "../types";
import tokenMap from './tokenMap';
import { keyvalues, keywords, regex, builtinTypes, libTags } from './constants';
import { ParserError } from "../parser/error";

function LexerError(msg: string): never {
  throw new Error(`Lexer Error: ${msg}`);
}

export function lex(code: string): Array<Token> {
  const result: Array<Token> = [];

  let index = 0;
  let currentChar = code[index];
  let peekChar = code[index + 1];

  function nextChar(skip = 1) {
    index += skip;
    currentChar = code[index];
    peekChar = code[index + 1];
  }

  while (index < code.length) {
    if (regex.whitespace.test(currentChar)) {
      if (currentChar === '\n')
        result.push({ type: 'newline', value: '\n' });
      nextChar();
      continue;
    }

    /* String Lexing */
    if (currentChar === '"') {
      nextChar();
      let parsedString = '';

      while (currentChar !== '"') {
        parsedString += currentChar;
        nextChar();
      }

      nextChar();
      result.push({ type: 'string', value: parsedString });
      continue;
    }

    /* Comment Lexing */
    if (currentChar === '#') {
      nextChar();
      let cond: () => boolean = () => currentChar as string !== '\n';
      let isMultilineComment = false;

      if (currentChar === '#') {
        nextChar();
        isMultilineComment = true;
        cond = () => !(currentChar === '#' && peekChar === '#');
      }

      // let parsedComment = '';
      while (cond()) {
        // parsedComment += currentChar;
        nextChar();
      }

      if (isMultilineComment)
        nextChar(2); // Skip the double '#' token

      // TODO: Add an compiler option for retain comment, which is `skipComment: false`
      // result.push({ type: 'comment', value: parsedComment });
      continue;
    }

    /* Library Tag Lexing */
    if (currentChar === '@' && (peekChar !== ' ' && peekChar !== '\n')) {
      let tag = '';
      nextChar();
      while (/[a-z|\-]+/.test(currentChar)) {
        tag += currentChar;
        nextChar();
      }

      if (!libTags.has(tag))
        ParserError(`LexerError: Unidentified library tag \`@${tag}\``);
      result.push({ type: 'lib-tag', value: tag });
      continue;
    }

    if (tokenMap.has(currentChar)) {
      if (currentChar === '-' && peekChar === '>') {
        result.push(tokenMap.get('->') as Token);
        nextChar(2);
        continue;
      }

      if (currentChar === '=') {
        if (peekChar === '>') {
          result.push(tokenMap.get('=>') as Token);
          nextChar(2);
          continue;  
        }

        if (peekChar === '=') {
          result.push(tokenMap.get('==') as Token);
          nextChar(2);
          continue;  
        }
      }

      if (currentChar === '>' && peekChar === '=') {
        result.push(tokenMap.get('>=') as Token);
        nextChar(2);
        continue;
      }

      if (currentChar === '<' && peekChar === '=') {
        result.push(tokenMap.get('<=') as Token);
        nextChar(2);
        continue;
      }

      if (currentChar === '!' && peekChar === '=') {
        result.push(tokenMap.get('!=') as Token);
        nextChar(2);
        continue;
      }

      if (currentChar === '|' && peekChar === '>') {
        result.push(tokenMap.get('|>') as Token);
        nextChar(2);
        continue;
      }

      result.push(tokenMap.get(currentChar) as Token);
      nextChar();
      continue;
    }

    if (regex.number.test(currentChar)) {
      let parsedNumber = '';

      do {
        parsedNumber += currentChar;
        nextChar();
      } while (regex.number.test(currentChar) && index < code.length)

      result.push({ type: 'number', value: parsedNumber });
      continue;
    }

    if (regex.letter.test(currentChar)) {
      let parsedName = '';

      do {
        parsedName += currentChar;
        nextChar();
      } while (regex.naming.test(currentChar) && currentChar !== undefined)

      if (keywords.has(parsedName)) {
        result.push({ type: 'keyword', value: parsedName });
        continue;
      }
      
      if (keyvalues.has(parsedName)) {
        if (parsedName === 'True' || parsedName === 'False') {
          result.push({ type: 'boolean', value: parsedName });
          continue;
        }
        if (parsedName === 'Null') {
          result.push({ type: 'null', value: parsedName });
          continue;
        }

        LexerError(`Unhandled key-value: \`${parsedName}\``);
      }

      if (builtinTypes.has(parsedName)) {
        result.push({ type: 'builtin-type', value: parsedName });
        continue;
      }

      result.push({ type: 'ident', value: parsedName });
      continue;
    }

    LexerError(`Unhandled Character: \`${currentChar}\``);    
  }

  return result;
}
