moztrap-new-ui
==============

A new frontend UI for [MozTrap](https://moztrap.mozilla.org/) that levarages on its REST API

# [Production Site](https://shinglyu.github.io/moztrap-new-ui/#/)

Use this [production site](https://shinglyu.github.io/moztrap-new-ui/#/)(only tested on [Firefox](https://www.mozilla.org/en-US/firefox/new/)) directly, or host on your own.

# Dependencies
* bower (`npm install -g bower` if you have Node.js and npm)
  
# Installation 
* `git clone` this repo.
* Run `bower install` to install 3rd party dependencies. ( A `bower_components` folder should be created.)
* If you need the diff function, run `git submoudle init; git submoudle update;`.
* Open the `index.html` in the browser.
* Summary: <div>
```
git clone https://github.com/shinglyu/moztrap-new-ui.git
cd moztrap-new-ui/
bower install
git submoudle init; git submoudle update;
firefox index.html &
```
</div>

# Testing
* Unit test: open `test/unit/unittest.html` in the browser
* Functional test: run `test/functional/run.sh` (Python + Selenium required)
  * Run `pip install selenium`
  
# Tutorial
* [Presentation Slides](https://dl.dropboxusercontent.com/u/7281903/slides-4d90fc/tutorial.md.html#/)
* [React.js Tutorial](http://shinglyu.github.io/moztrap-new-ui/tutorial.html): A step-by-step guide on how the site is built using React.js, with live demo and commented code.

# Related Projects
* [MozTrap](https://github.com/mozilla/moztrap/) - The upstream project. The MozTrap test case management system.
* [MozTrap API Tester](https://github.com/shinglyu/moztrap-api-tester) - Help you test and explore MozTrap's REST API
* [MozTrap CLI](https://github.com/shinglyu/moztrap-cli) - A MozTrap commandline interface for editing test cases offline. 
* [MozTrapHelper](https://github.com/shinglyu/MozTrapHelper) - An addon to workaround old MozTrap's performance issue. We might levarage this to combine the old and new UI.

# Contributing
We are migrating our backlog from Trello to GitHub. Simply submit bugs or feature requests using the GitHub "issues" to the right side of the page.

The feature requests are in this [Trello board](https://trello.com/b/FvWTBKjf/moztrap-enhancement-backlog), ask slyu@mozilla.com for access right. Everyone is welcomed to pick a bug/feature and work on it.
