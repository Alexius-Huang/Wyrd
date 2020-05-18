export default class Exception {
  constructor(
    public readonly type: string,
    public readonly message: string
  ) {}
}

export const NoTokenLeftException = new Exception(
  'NoTokenLeftException',
  'TokenTracker: Out of bound, there are no tokens left for tracking'
);
