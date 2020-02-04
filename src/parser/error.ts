export function ParserError(msg: string): never {
  throw new Error(`ParserError: ${msg}`);
}

export function ParserErrorIf(bool: boolean, msg: string): void {
  if (bool) ParserError(msg);
}
