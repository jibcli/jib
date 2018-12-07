import { Command, BaseCommand } from '@jib/cli';

export interface I<%- className %>Options {
  // define invocation option types here
}

@Command({
  description: '<%- name %> command',
  options: [ /** Configure command options */ ],
  args: [ /** Configure any arguments */ ],
})
export class <%- className %>Command extends BaseCommand {
  public help(): void {
    // print additional help here
    // this.ui.output(...)
  }
  public async run(options: I<%- className %>Options, ...args: string[]) {
    this.ui.output(`Hello from <%- name %>`);
    // Do <%- name %> things...
  }
}
