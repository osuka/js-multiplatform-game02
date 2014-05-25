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






