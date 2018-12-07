export const STRINGS = {
  PMT_PROJECT_NAME: 'Package name?',
  PMT_BIN_NAME: 'CLI bin name?',
  PMT_NOTEMPTY_MKDIR: 'Folder is not empty, would you like to make a new directory?',
  PMT_CLI_TYPE: 'CLI type?',
  PMT_COMMAND_NAME: 'Command name?',
  ERR_PROJECT_REQUIRED: 'A project name is required',
  ERR_COMMAND_REQUIRED: 'A command name is required',
  ERR_BIN_REQUIRED: 'A cli name is required',
};

export const CONST = {
  COMMAND_OUTDIR: 'build/commands',
  COMMAND_SRCDIR: 'src/commands',
  COMMAND_ROOT: 'root',
  CORE_DEPS: ['@jib/cli'],
  CORE_DEVDEPS: ['@jib/tslint', '@types/node', 'typescript', 'tslint', 'ts-node'],
};
