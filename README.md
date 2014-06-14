# Initial project creation notes

Using cocos2d-JS.

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

- Manually copy jsbinding files from cocos2d-x: (not entirely sure way these were not copied to begin with)

```
cd js-multiplatform-game02/frameworks/js-bindings/cocos2d-x/plugin
cp -r ~/Downloads/cocos2d-x-3.1.1/plugin/jsbindings/manual/* jsbindings/manual/
cp -r ~/Downloads/cocos2d-x-3.1.1/plugin/jsbindings/auto/* jsbindings/auto/
cp -r ~/Downloads/cocos2d-x-3.1.1/plugin/protocols/* protocols/
```

- Manually update iOS project paths:

Add to js-multiplatform-game02.xcodeproj, TARGET js-multiplatform-game02 iOS, on 
"User Header Search Paths":

```
$(SRCROOT)/../../js-bindings/cocos2d-x/cocos/platform/ios
```

- Manually update Resource iOS project:

- Add a reference (don't copy!) to jsb_ext_create_apis.js to "JS Common".
- Add a reference to bundled_scripts.js to "JS Common". 
- Add both jsb_ext_create_api.js and bundled_scripts.js to the "Copy Bundle Resources" section, for iOS & Mac.





