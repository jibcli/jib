# <%- className + (options.bin ? ' Command Line' : ' Plugin') %>

## About

This project was generated using the [`jib`](https://www.npmjs.com/package/@jib/jib)
command line generator.

## Usage

```shell<% if (options.bin) { %>
npm install -g <%- name %>
<%- options.bin %> --help
<% } else { %>
npm install --save <%- name %>
<% } %>```