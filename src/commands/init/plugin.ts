import { Command, BaseCommand, Plugin } from '@jib/cli';
import { GeneratorEnv } from '@jib/codegen';
import { CONST } from '../../lib/constants';
import { IProjectGeneratorOptions, PROJECT_TYPE } from '../../generators/project/generator';

export interface IPluginOptions {

}

@Command({
  description: 'Create a @jib/cli plugin',
  options: [
    { flag: '-I, --no-install', description: `skip project installation` },
  ],
  args: [
    { name: 'dependencies', description: 'Any dependencies used by the plugin', optional: true, multi: true },
  ],
})
export class PluginCommand extends BaseCommand {

  @Plugin(GeneratorEnv, __dirname)
  private _gen: GeneratorEnv;

  public help(): void {
    const sampleDep = 'node-fetch';
    this.ui.outputSection('Examples', this.ui.grid([
      [`$> jib init plugin`, this.ui.color.dim('# Create empty plugin')],
      [`$> jib init plugin ${sampleDep}`, this.ui.color.dim(`# Create a plugin with a dependency on ${sampleDep}`)],
    ]));
  }
  public async run(options: IPluginOptions, deps: string[] = []) {
    const { GEN_PROJECT } = CONST;

    return this._gen.load(GEN_PROJECT)
      .run(GEN_PROJECT, <IProjectGeneratorOptions>{ ...options, type: PROJECT_TYPE.PLUGIN }, deps);
  }
}
