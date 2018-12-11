import * as fs from 'fs';
import * as path from 'path';
import * as Yeoman from 'yeoman-generator';

import { JibGen, IJibGenOptions } from '../base';
import { STRINGS, CONST } from '../../lib/constants';
import { IInitOpts } from '../../commands/init';
import { ICommandGeneratorOptions } from '../command/generator';
import { classCase } from '../../lib/strings';
import { IProjectConfig, Workspace, JIB, VERSION } from '@jib/cli';

export interface IProjectGeneratorOptions extends IJibGenOptions, IInitOpts {
  type?: PROJECT_TYPE;
  name?: string; // project package name
  mkdir?: boolean;
  bin?: string; // project bin name
}

interface IProjectTemplateVars {
  name: string;
  className: string;
  emitDeclaration: boolean;
  options: IProjectGeneratorOptions;
  CONST: any;
}

const REG = {
  FILTER_PKG: /[^\@\w\/-]/g,
  FILTER_BIN: /[^\w\/-]/g,
};

export enum PROJECT_TYPE {
  BIN = 'bin',
  PLUGIN = 'plugin',
}

export class ProjectGenerator extends JibGen<IProjectGeneratorOptions> {

  protected dirname: string;

  constructor(...args: any[]) {
    super(...args);

    this
      .option('bin', { type: String })
      .option('type', { type: String, default: PROJECT_TYPE.BIN });

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
    const { single, type } = this.options;
    if (type === PROJECT_TYPE.BIN) {
      this.composeWith('command', <ICommandGeneratorOptions>{
        command: single && [CONST.COMMAND_ROOT],
      });
    }
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
    const { bin, type } = this.options;
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
        when: type === PROJECT_TYPE.BIN && !bin,
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
    const { name, mkdir, type, ...rest } = this.options;
    if (mkdir) {
      this.log(`Creating directory ${this.ui.color.bold(name)}`);
      const dir = this.destinationPath(name);
      if (!fs.existsSync(dir)) {
        this.dirname = name;
        this.destinationRoot(dir);
      } else {
        this._error(`Path ${name} already exists`);
      }
    }
    // establish template vars
    const vars: IProjectTemplateVars = {
      name,
      className: classCase(name),
      emitDeclaration: type !== PROJECT_TYPE.BIN,
      options: rest,
      CONST,
    };
    // write main project
    this._writeTemplates('', vars, false);
    // write specific project files
    switch (type) {
      case PROJECT_TYPE.PLUGIN:
        return this.__writePlugin(vars);
      case PROJECT_TYPE.BIN:
      default:
        return this.__writeBin(vars);
    }
  }

  /**
   * perform package installation
   */
  public install(): any {
    const { install, type } = this.options;
    if (install) {
      const saveDev = {'save-dev': true};
      this.npmInstall(CONST.CORE_DEVDEPS, saveDev);
      switch (type) {
        case PROJECT_TYPE.PLUGIN:
          this.npmInstall(CONST.CORE_DEPS, saveDev); // @jib/cli as devDep
          break;
        case PROJECT_TYPE.BIN:
        default:
          this.npmInstall(CONST.CORE_DEPS);
          return this._npm(['link']); // link binary
      }
    } else {
      this.log(`${this.ui.color.yellow('WARN:')} skip install`);
    }
  }

  public end(): void {
    // all done
    this.log(`Done ${this.ui.color.green(CONST.SYMBOL_SUCCESS)}`);
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

  /**
   * write templates for bin project
   */
  private __writeBin(vars?: IProjectTemplateVars): void {
    const { bin, single } = this.options;
    const { COMMAND_ROOT, COMMAND_DIR, PROJECT_BUILD } = CONST;
    this._writeTemplates('bin', { bin }, true);
    this.fs.extendJSON(this.destinationPath('package.json'), <any>{
      preferGlobal: true,
      bin: {
        [bin]: `bin/${bin}`,
      },
      [JIB]: <IProjectConfig>{
        // TODO: preserve existing
        commandDir: path.join(PROJECT_BUILD, COMMAND_DIR),
        commandDelim: ' ',
        ...(single ? { rootCommand: COMMAND_ROOT } : {}),
      },
    });
  }

  /**
   * write templates for plugin project
   */
  private __writePlugin(vars: IProjectTemplateVars): void {
    this.log('HERE WE GO!');
    const { PROJECT_SRC, PROJECT_BUILD } = CONST;
    // reconfigure src/dest
    const [tmpl, dest] = [this.sourceRoot(), this.destinationRoot()];
    this.sourceRoot(Workspace.resolveDir(tmpl, 'plugin'));
    this.destinationRoot(this.destinationPath(PROJECT_SRC));
    // write
    this.fs.extendJSON(this.destinationPath('..', 'package.json'), {
      main: `${PROJECT_BUILD}/index.js`,
      types: `${PROJECT_BUILD}/index.d.ts`,
      peerDependencies: {
        '@jib/cli': `^${VERSION}`,
      },
    });
    this._writeTemplates('', vars, true);
    // restore
    this.sourceRoot(tmpl);
    this.destinationRoot(dest);
  }

}
