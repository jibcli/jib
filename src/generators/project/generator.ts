import * as fs from 'fs';
import * as path from 'path';
import * as Yeoman from 'yeoman-generator';

import { JibGen, IJibGenOptions } from '../base';
import { STRINGS, CONST } from '../../lib/constants';
import { IInitOpts } from '../../commands/init';
import { ICommandGeneratorOptions } from '../command/generator';

export interface IProjectGeneratorOptions extends IJibGenOptions, IInitOpts {
  bin?: string; // project bin name
  name?: string; // project package name
  mkdir?: boolean;
}

const REG = {
  FILTER_PKG: /[^\@\w\s\/-]/g,
  FILTER_BIN: /[^\w\/-]/g,
};

export class ProjectGenerator extends JibGen<IProjectGeneratorOptions> {

  protected dirname: string;

  constructor(...args: any[]) {
    super(...args);

    this.argument('bin', { required: false });

    const { bin, install } = this.options;

    // update options from command invocation
    this.options = {
      ...this.options,
      skipInstall: !install,
      bin: bin === 'undefined' ? undefined : bin,
    };
  }

  /**
   * prep the generator composition
   */
  public default() {
    // add command generator
    const { single } = this.options;
    this.composeWith('command', <ICommandGeneratorOptions>{
      command: single && CONST.COMMAND_ROOT,
      dir: null,
    });
  }

  /**
   * initialize the target workspace
   */
  public initializing() {
    this.dirname = path.basename(this.destinationRoot());
  }

  /**
   * prompt as necessary
   */
  public prompting(): Promise<any> {
    const { bin } = this.options;
    const { name } = this.existingPkg;
    // prepare prompts
    const q: Yeoman.Questions = [
      /**
       * Confirm making a new directory when folder is not empty.
       * @default true when not a jib project
       */
      {
        type: 'confirm',
        name: 'mkdir',
        message: STRINGS.PMT_NOTEMPTY_MKDIR,
        default: !this._isJib(),
        when: !this._isEmpty(),
      },
      /**
       * Determing project name when not existing package.json
       */
      {
        type: 'input',
        name: 'name',
        message: STRINGS.PMT_PROJECT_NAME,
        default: this._filterStr(bin || this.dirname, REG.FILTER_PKG),
        when: !name,
        filter: (n: string) => this._filterStr(n, REG.FILTER_PKG),
        validate: (n: string) => !!n || STRINGS.ERR_PROJECT_REQUIRED,
      },
      /**
       * Resolve bin name
       */
      {
        type: 'input',
        name: 'bin',
        message: STRINGS.PMT_BIN_NAME,
        default: ((a: any): string => this._filterStr(a.name ? a.name : name, REG.FILTER_BIN)),
        when: !bin,
        filter: (n: string) => this._filterStr(n, REG.FILTER_BIN),
        validate: (n: string) => !!n || STRINGS.ERR_BIN_REQUIRED,
      },
    ];
    // start prompts
    return this.prompt(q).then(ans => {
      this.options = { name, ...this.options, ...ans };
    });
  }

  /**
   * write files to memfs
   */
  public writing(): void {
    const { bin, name, mkdir } = this.options;
    if (mkdir) {
      this.log(`Creating directory ${this.ui.color.bold(name)}`);
      const dir = this.destinationPath(name);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        this.dirname = name;
        this.destinationRoot(dir);
      } else {
        this._error(`Path ${name} already exists`);
      }
    }
    const vars: any = {
      ...this.options,
      options: this.options,
      rootCommand: CONST.COMMAND_ROOT,
    };
    this._writeTemplates('', vars, true);
  }

  /**
   * perform package installation
   */
  public install(): any {
    const { install } = this.options;
    if (install) {
      this.npmInstall(CONST.CORE_DEPS);
      this.npmInstall(CONST.CORE_DEVDEPS, {'save-dev': true});
      return this._npm(['link']);
    }
  }

  /**
   * filter templates during writing
   */
  protected _templateFilter(src: string): boolean {
    const { tests } = this.options;
    const file = path.basename(src);
    if (!tests) {
      const excludes = ~['.nycrc'].indexOf(file) ||
        /spec[\\\/]/.test(src);
      return !excludes;
    }
    return true;
  }

}
