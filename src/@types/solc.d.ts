declare module 'solc' {
  function compile(input: string): string;
  function loadRemoteVersion(version: string, callback: (err: Error | null, solc: any) => void): void;
  function version(): string;
  export = compile;
} 