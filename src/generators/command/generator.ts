
import { JibGen, IJibGenOptions } from '../base';
import * as Yeoman from 'yeoman-generator';
import { STRINGS, CONST } from '../../lib/constants';
import { classCase } from '../../lib/strings';

export interface ICommandGeneratorOptions extends IJibGenOptions {
  command?: string;
  dir?: string;
}

const REG = {
  FILTER_COMMAND: /[^a-z-]/ig,
};

export class CommandGenerator extends JibGen<ICommandGeneratorOptions> {
  public description: string = `Create a new command implementation`;

  constructor(...args: any[]) {
    super(...args);
    this.argument('command', { required: false, type: String, default: '' })
      .argument('dir', { required: false, type: String, default: '' });
  }

  public initializing() {
    if (this._isRoot() && !this._isJib()) {
      this._error(`Invalid project directory: ${this.ui.color.red(this.destinationRoot())}`);
    }
  }

  public prompting(): Promise<any> {
    const { command } = this.options;
    const q: Yeoman.Questions = [
      {
        type: 'input',
        name: 'command',
        message: STRINGS.PMT_COMMAND_NAME,
        when: !command,
        filter: (n: string) => this._filterStr(n, REG.FILTER_COMMAND),
        validate: (n: string) => !!n || STRINGS.ERR_COMMAND_REQUIRED,
      },
    ];
    return this.prompt(q).then((ans: any) => {
      this.options = { ...this.options, ...ans };
    });
  }

  public writing(): void {
    const { command, dir } = this.options;
    // capture dest
    const orig = this.destinationRoot();
    // determine output
    const tree = [CONST.COMMAND_SRCDIR, (dir || '').replace(CONST.COMMAND_SRCDIR, '')].filter(p => !!p);
    this.destinationRoot(this.destinationPath(...tree));
    // write
    this._writeTemplates('', {
      name: this._filterStr(command, REG.FILTER_COMMAND).toLowerCase(),
      className: classCase(command),
    });
    // restore destination
    this.destinationRoot(orig);
  }

}
