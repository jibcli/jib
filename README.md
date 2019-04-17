# Quickstart jib CLI

The `jib` CLI for building [`@jib/cli`](https://github.com/jibcli/cli)
projects.

[![npm version](https://badge.fury.io/js/%40jib%2Fjib.svg)](https://badge.fury.io/js/%40jib%2Fjib)
[![wercker status](https://app.wercker.com/status/0f58790a09b5361bfc3546c8230e4201/s/master "wercker status")](https://app.wercker.com/project/byKey/0f58790a09b5361bfc3546c8230e4201)
[![codecov](https://codecov.io/gh/jibcli/jib/branch/master/graph/badge.svg)](https://codecov.io/gh/jibcli/jib)
[![GitHub license](https://img.shields.io/github/license/jibcli/jib.svg)](https://github.com/jibcli/jib/blob/master/LICENSE)

## Usage

This project may be installed globally, or used with `npx`. For the purposes of
simplicity, the resulting CLI will be referenced as `jib`

```shell
npx @jib/jib
# or install globally
npm install -g @jib/jib
```

### Starting New Projects

The `jib init` command is the quickest way to get started with a `@jib/cli` project.

```text
jib init --help
```

### Adding More Commands

Once a project is created, more commands can be added using `jib add command`.

```text
jib add command --help
```

## TODOs

- [x] Deep level command augmentation `jib add command [name] [path]`
- [x] Automatically link the installed CLI `npm link`
- [x] Add plugin generator `jib plugin`
- [ ] Include unit testing scaffolding
- [ ] Allow choice of CI (currently wercker)
