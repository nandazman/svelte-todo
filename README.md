# Todolist app using svelte

This is a responsive todolist project using svelte and scss.

## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:7777](http://localhost:7777). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

### Add SASS
Add sass with this [link](https://daveceddia.com/svelte-with-sass-in-vscode/).
```
yarn add svelte-preprocess autoprefixer node-sass
```

Then, go to rollup.config.js

```
import autoPreprocess from 'svelte-preprocess';
svelte({
  ...,
  <!-- add this line -->
  preprocess: autoPreprocess()
})
<!-- add into plugins -->
preprocess
```

add svelte.config.js on root. This will make svelte know the scss syntax.

```
const sveltePreprocess = require('svelte-preprocess');

module.exports = {
    preprocess: sveltePreprocess(),
};
```

ctrl + shift + p -> search Svelte: Restart Language Server.
on your style add attributer lang="scss".
Your preprocess using scss is ready to go.
