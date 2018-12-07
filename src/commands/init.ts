import { Command, BaseCommand, Plugin } from '@jib/cli';
import { GeneratorEnv, IGeneratorUsage } from '@jib/codegen';

export interface IInitOpts {
  single?: boolean;
  tests?: boolean;
  install?: boolean;
}

const [PROJECT_GENERATOR] = ['project'];

@Command({
  allowUnknown: true,
  description: 'Begin a new CLI project',
  options: [
    { flag: '-s, --single', description: `init a single command CLI` },
    // { flag: '-T, --no-tests', description: `init without unit tests` },
    { flag: '-I, --no-install', description: `skip project installation` },
  ],
  args: [
    { name: 'bin', optional: true, description: `top level bin for the project` },
  ],
})
export class InitCmd extends BaseCommand {

  @Plugin(GeneratorEnv, __dirname)
  private _gen: GeneratorEnv;

  public help(): void {
    // const usage: IGeneratorUsage = this._gen
    //   .usage(PROJECT_GENERATOR).shift();

    // if (usage.description) {
    //   this.ui.outputSection(usage.description, '');
    // }

    this.ui.outputSection('Examples', this.ui.grid([
      [`$> jib init`, this.ui.color.dim('Init with prompts')],
      [`$> jib init mycli`, this.ui.color.dim('Create CLI project: mycli')],
      [`$> jib init singlecmd --single`, this.ui.color.dim('Creates a single CLI: singlecmd')],
    ]));
  }

  public async run(options: IInitOpts, bin?: string) {
    this.logger.debug(`Init with options`, options);

    return this._gen.loadAll()
      .run(PROJECT_GENERATOR, options as any, bin);
  }
}
