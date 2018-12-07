import * as os from 'os';
import * as fs from 'fs';
import { Workspace, UI } from '@jib/cli';
import { BaseGenerator, IBaseGeneratorOptions, SubGeneratorOptions } from '@jib/codegen';

export interface IJibGenOptions extends IBaseGeneratorOptions {

}

const NPM: string = /^win/.test(os.platform()) ? 'npm.cmd' : 'npm';

export abstract class JibGen<T> extends BaseGenerator<T> {

  protected existingPkg: any = {};
  protected ui = new UI.Writer();

  constructor(...args: any[]) {
    super(...args);
    try {
      this.existingPkg = Workspace.getPackageJson(this.destinationRoot());
    } catch (e) { /* noop */}
  }

  protected _isEmpty(): boolean {
    return !fs.readdirSync(this.destinationRoot()).length;
  }

  protected _isJib(): boolean {
    return !!(this.existingPkg && this.existingPkg.bin && this.existingPkg.jib);
  }

  protected _isRoot(): boolean {
    const { parent } = this.options as SubGeneratorOptions;
    return !parent;
  }

  protected _filterStr(str: string, filter: RegExp): string {
    return (str || '').replace(filter, '');
  }

  protected _error(...err: any[]): void {
    return this.env.error(...err);
  }

  protected _npm(args: string[], options?: any): any {
    return this.spawnCommandSync(NPM, args, options);
  }
}
