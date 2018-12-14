# <%- className + (options.bin ? ' Command Line' : ' Plugin') %>

## About

This project was generated using the [`jib`](https://www.npmjs.com/package/@jib/jib)
command line generator.

## Usage

```shell<% if (isBinType) { %>
npm install -g <%- name %>
<%- options.bin %> --help
<% } else { %>
npm install --save <%- name %>
<% } %>```

<% if (isPluginType) { %>

Using within `@jib/cli` commands:

```typescript
import { Command, Plugin } from '@jib/cli';
import { <%- className %> } from '<%- name %>';

@Command({/* */})
class MyCustomCommand {
  // inject plugin
  @Plugin(<%- className %>)
  public helper: <%- className %>;

  public async run(options: any, ...args: string[]) {
    // this.helper...
  }
}
```<% } %>
