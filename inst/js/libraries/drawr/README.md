# ShinyDraw

(or `drawr`)

This is a work in progress for implementing drawing to get data out into an easy to use shiny module.

No shiny implementation is yet here. Currently it's getting polished as a javascript class which will then be
duct taped into a shiny module. Most likely will end up in the `shinysense` package.

## Running it yourself.

```bash
git clone git@github.com:jhudsl/shinyDraw.git
cd ShinyDraw/demo
open index.html
```

This should give you a nice and usable demo to play with.


## Editing it yourself.

__Bash Commands__

```bash
git clone git@github.com:jhudsl/shinyDraw.git
cd ShinyDraw
npm install #this takes too long because javascript's package landscape is a bloated giant.
open demo/index.html
npm start   #kick off a server that automagically "transpiles" your javascript code into code that runs on any browser.
```

This should open up your browser to a test page. Notice how your terminal is now not working? That's because it's
sitting watching for any changes that are made to `src/main.js` which is the final point of our package. You can now
change something in this file then save it and your terminal will show you it has re-transpiled all your code and spit out
a new javascript bundle to `demo/youDrawIt.js`. Once you have gotten it to do what you desire,  kill your node watcher with `ctrl + c` and then run `npm run build` and it will generate the javascript bundle again and put it into the `dist/` directory, ready for easy consumption.
