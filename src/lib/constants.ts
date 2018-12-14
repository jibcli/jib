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
  GEN_PROJECT: 'project',
  GEN_COMMAND: 'command',
  GEN_PLUGIN: 'plugin',
  PROJECT_SRC: 'src',
  PROJECT_BUILD: 'build',
  COMMAND_DIR: 'commands',
  COMMAND_ROOT: 'root',
  CORE_DEPS: ['@jib/cli'],
  CORE_DEVDEPS: ['@jib/tslint', '@types/node', 'rimraf', 'typescript', 'tslint', 'ts-node'],
  SYMBOL_SUCCESS: '✓',
  SYMBOL_ERROR: '✗',
};
