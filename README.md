# A Javascript-based base game for iOS, Android and HTML5 devices

# Summary

This is a relatively simple game made using open source technologies
and with almost all of the logic in cross-platform Javascript.

This is an updated version of [js-multiplatform-game01](https://github.com/osuka/js-multiplatform-game01) to work with cocos2d-x-3.1 and cocos2d-js-3.0-beta.

I'm using:

* npm, browserify for dependency management
* grunt for building
* cocos2d-x (3.1) and cocos2d-js (3.0-beta) as the game engine
* chipmunk as the physics engine
* Inkscape for graphics

Requirements:
* node 0.10.24 to trigger everything else
* A version of python is currently needed to run the Android build
script (plans to migrate it to node).

You are encouraged to reuse this in any way you want and to give
feedback and report errors or suggestions using the github page.

# Installation

* Make sure you have `node` installed. If not, get it from [the nodejs website](http://nodejs.org/).
* Install `grunt`, the tool used for building the game. Run `npm install -g grunt-cli` to do so.

* Get a copy of the repository using [`git`](http://git-scm.com/).

```
git clone https://github.com/osuka/js-multiplatform-game02
```

* Use the node package manager to download all the external libraries.

```
npm install -g grunt-cli
npm install
```

You are almost done!

# Launching the HTML5 version

You can run the HTML5 version in your computer executing the following:

```
grunt server
```
(then navigate to [http://localhost:9000](http://localhost:9000))


# Launching the XCode (iOS, Mac) version

* Build the game using `grunt build:ios`
* Open `frameworks/runtime-src/proj.ios_mac/js-multiplatform-game02.xcodeproj`.

Launch as usual.

# Launching the Android version

* Make sure you have a `python` interpreter available.
* Make sure Android SDK and Android NDK are installed, and that `ANDROID_SDK_ROOT` and `NDK_ROOT` are defined.
* If using Eclipse, first time do:
  * Import `js-multiplatform-game02/frameworks/js-bindings/cocos2d-x/cocos/platform/android/java` into your IDE. This will create the project `libcocos3dx`.
  * Import `js-multiplatform-game02/frameworks/runtime-src/proj.android` into your IDE. This will create the `js-multiplatform-game02` project.
  * Exit Eclipse, open `js-multiplatform-game02/frameworks/runtime-src/proj.android/.project` and remove:
```
<nature>org.eclipse.cdt.core.cnature</nature>
<nature>org.eclipse.cdt.core.ccnature</nature>
<nature>org.eclipse.cdt.managedbuilder.core.managedBuildNature</nature>
<nature>org.eclipse.cdt.managedbuilder.core.ScannerConfigNature</nature>
```
  * Remove `js-multiplatform-game02/frameworks/runtime-src/proj.android/.cproject` if present

(this is because Eclipse automatically adds c-nature to projects but we will be compiling via command line)

* Then: 
  * Build the game using `grunt build:android`
  * Right click on `js-multiplatform-game02` an "Run as" Android Application from the IDE.
* Of if you just want to use the command line
  * Install on a device using `ant -Dsdk.dir=${ANDROID_SDK_ROOT} debug install` (needs `ant`)

Optionally, choose the desired supported Android OS versions in properties for both projects.


# Advanced

## Syntax and error checker (Linter, jshint)

This project uses (and enforces) a strict Javascript syntax and policy. It's using the common `jshint` tool to do it.

The exact policy is defined in the file `.jshintrc`. It may seem annoying at the beginning but it helps a lot in keeping code tidy and identifies a lot of common errors like use of undefined variables, unintended redefinition variables and so on.

## Automatic syntax/error checking using Sublime text editor

If you use Sublime text editor you can have it automatically invoke `jshint` and highlight on screen any possible errors. I highly recommend you give it a try.

To enable it, just make sure the linter is globally available by running:

```
npm install -g jshint
```

And then in Sublime:

* Install [Package Control](https://sublime.wbond.net/installation)
* Use it to install `SublimeLinter` and `SublimeLinter-jshint` packages
* Restart the editor

To make life even easier, you can define the following User Settings:

* "tab_size": 2
* "translate_tabs_to_spaces": true
* "rulers": [80],




# Initial project creation notes

The following was used to create the base project, with cocos2d-JS.

```
cd ~/code
git clone https://github.com/cocos2d/cocos2d-JS/
cd cocos2d-JS
git submodule update --init
cd frameworks/js-bindings/cocos2d-x
./download-deps.py
cocos new -p com.gatillos.js02 -l js -d ~/code/ js-multiplatform-game02
```

After this, the structure will look something like:
```
- frameworks
  |- cocos2d-html5
  |- js-bindings
     |- bindings
     |- cocos2d-x
     \- external
        \- spidermonkey
  |- runtime-src
     |- Classes
        |- AppDelegate.cpp
        |- AppDelegate.h
     |- proj.android
        |- AndroidManifest.xml
        |- build.xml
        \- (...)
     |- proj.ios_mac
        - ios
          |- AppController.h
          |- AppController.mm
          |- Icons*.png
          |- Info.plist
          |- RootViewController.h
          |- RootViewController.mm
          |- main.m
          \- Prefix.pch
        - mac
          |- main.cpp
          |- Icon.icsn
          |- Info.plist
          \- Prefix.pch
        - js-multiplatform-game02.xcodeproj
          \- project.pbxproj
     |- runtime-src/proj.win32
- res
  |- CloseNormal.png
  |- CloseSelected.png
  |- HelloWorld.png
  \- favicon.ico
- runtime
  |- android
  \- ios
- src
  |- app.js
  \- resource.js
- tools
  |- bindings-generator
  \- tojs
- index.html
- main.js
- project.json
```

- Had to manually copy jsbinding files from cocos2d-x: (not entirely sure way these were not copied to begin with)

```
cd js-multiplatform-game02/frameworks/js-bindings/cocos2d-x/plugin
cp -r ~/Downloads/cocos2d-x-3.1.1/plugin/jsbindings/manual/* jsbindings/manual/
cp -r ~/Downloads/cocos2d-x-3.1.1/plugin/jsbindings/auto/* jsbindings/auto/
cp -r ~/Downloads/cocos2d-x-3.1.1/plugin/protocols/* protocols/
```

- Had to manually update iOS project paths:

Add to js-multiplatform-game02.xcodeproj, TARGET js-multiplatform-game02 iOS, on "User Header Search Paths":

```
$(SRCROOT)/../../js-bindings/cocos2d-x/cocos/platform/ios
```

- Manually update Mac project path:

Add to js-multiplatform-game02.xcodeproj, TARGET js-multiplatform-game02 Mac, on "User Header Search Paths":

```
$(SRCROOT)/../../js-bindings/cocos2d-x/cocos/platform/mac
```

- Manually update Resource iOS and Mac projects:

- Add a reference (don't copy!) to jsb_ext_create_apis.js to "JS Common".
- Add a reference to bundled_scripts.js to "JS Common". 
- Add both jsb_ext_create_api.js and bundled_scripts.js to the "Copy Bundle Resources" section, for iOS & Mac.





