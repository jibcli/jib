import { Command, BaseCommand, Plugin } from '@jib/cli';
import { GeneratorEnv } from '@jib/codegen';

export interface IAddCommandOptions {

}

const [COMMAND_GENERATOR] = ['command'];

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
    return this._gen.load(COMMAND_GENERATOR)
      .run(COMMAND_GENERATOR, options, ...args);
  }
}
