export function ParserError(msg: string): never {
  throw new Error(`Parser: ${msg}`);
}
