declare module "bun:sqlite" {
  export class Database {
    constructor(filename: string, options?: any);
    exec(sql: string): void;
    prepare(sql: string): Statement;
    close(): void;
  }

  export class Statement {
    run(...params: any): any;
    get(...params: any): any;
    all(...params: any): any;
  }
}
