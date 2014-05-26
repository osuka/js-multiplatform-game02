/* globals cc */
(function () {
  'use strict';

  var GameController = require('./gameController');
  var Resources = require('./resource');

  // Bootstrap a project when inside a browser
  //
  if (typeof document !== 'undefined') {

    // Define a Fake "system.getDPI"
    if (typeof cc.Device === 'undefined' ||
      typeof cc.Device.getDPI === 'undefined') {
      cc.Device = {};
      cc.Device.getDPI = function () {
        var dpi = 96; // standard monitor
        return dpi;
      };
    }
  
    cc.game.onStart = function () {
      cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
      cc.view.resizeWithBrowserSize(true);
      //load resources
      /*jshint camelcase: false */
      cc.LoaderScene.preload(Resources, function () {
        GameController.boot();
      }, this);
      /*jshint camelcase: true */
    };
    // cc.game.run();

    // var Cocos2dWebApp = cc.Application.extend({
  
    //   config : document.ccConfig,
    // 
    //   ctor : function (/*scene*/) {
    //     this._super();
    //     cc.COCOS2D_DEBUG = this.config.COCOS2D_DEBUG;
    //     cc.initDebugSetting();
    //     cc.setup(this.config.tag);
    //     cc.AppController.shareAppController()
    //        .didFinishLaunchingWithOptions();
    //   },
    // 
    //   applicationDidFinishLaunching: function () {
    //     if (cc.RenderDoesnotSupport()) {
    //       window.alert('Browser doesn\'t support WebGL');
    //       return false;
    //     }
    //     cc.EGLView.getInstance().setDesignResolutionSize(
    //       window.innerWidth,
    //       window.innerHeight,
    //       cc.RESOLUTION_POLICY.SHOW_ALL);
    // 
    //     // preload resources for browser-hosted app,
    //     // and only run after finish
    //     cc.LoaderScene.preload(Resources, function () {
    //       GameController.boot();
    //     }, this);
    // 
    //     return true;
    //   }
    // });

    // Init cocos2d loader
    //new Cocos2dWebApp();

  } else {

    // Bootstrap a project when running inside a container
    // that is not browser or webview-based

    // This is an example of exporting (binding) a C++ function to Javascript
    // var testJSB = new JSB.JSBinding();
    // testJSB.retain(); // don't want Spidermonkey to garbage collect this
    // testJSB.functionTest();

    // // Export Device's getDPI function
    // if (typeof cc.Device === 'undefined' ||
    //   typeof cc.Device.getDPI === 'undefined') {
    //   cc.Device = {};
    //   cc.Device.getDPI = function () {
    //     return testJSB.getDPI();
    //   };
    // }

    // cc.dumpConfig();
 
    cc.game.onStart = function () {
      cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
      cc.view.resizeWithBrowserSize(true);
      //load resources
      /*jshint camelcase: false */
      cc.LoaderScene.preload(Resources, function () {
        GameController.boot();
      }, this);
      /*jshint camelcase: true */
    };
    cc.game.run();
  }
})();
