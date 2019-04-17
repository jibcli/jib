<% for (let i=0; i<deps.length; i++) { %>
import * as <%- deps[i].name %> from '<%- deps[i].pkg %>';<% } %>
import { Provide } from '@jib/cli';
<% if (deps.length) { %>
// declare interface as extension of its dependencies (optional)
// export interface <%- className %> extends <%- deps.map(d => d.name).join(', ') %> { }<% } %>

@Provide<<%- className %>>({
  // define factory for plugin instantiation (optional)
  factory: () => <%- className %>.init(),
})
export class <%- className %> {
  public static init(): <%- className %> {
    const instance = new this();
    // use singleton, supply configurations, perform modifications or extensions, etc.
    return instance;
  }
}
