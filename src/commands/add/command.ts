import { Command, BaseCommand, Plugin } from '@jib/cli';
import { GeneratorEnv } from '@jib/codegen';
import { CONST } from '../../lib/constants';

export interface IAddCommandOptions {

}

@Command({
  description: 'Add commands to an existing project',
  options: [],
  args: [
    { name: 'path', description: 'Space-delimited command path', optional: true, multi: true },
  ],
})
export class AddCommand extends BaseCommand {

  @Plugin(GeneratorEnv, __dirname)
  private _gen: GeneratorEnv;

  public help(): void {
    this.ui.outputSection('Examples', this.ui.grid([
      [`$> jib add command`, this.ui.color.dim('# Add using prompts')],
      [`$> jib add command foo bar`, this.ui.color.dim('# Add in specific hierarchy (foo bar)')],
    ]));
  }

  public async run(options: IAddCommandOptions, args: string[] = []) {
    const { GEN_COMMAND } = CONST;
    return this._gen.load(GEN_COMMAND)
      .run(GEN_COMMAND, options, ...args);
  }
}
