/* global cc */
/* global HelloWorldScene */
/* global g_resources */
'use strict';
cc.game.onStart = function () {
  cc.view.setDesignResolutionSize(800, 450, cc.ResolutionPolicy.SHOW_ALL);
  cc.view.resizeWithBrowserSize(true);
  //load resources
  /*jshint camelcase: false */
  cc.LoaderScene.preload(g_resources, function () {
    cc.director.runScene(new HelloWorldScene());
  }, this);
  /*jshint camelcase: true */
};
cc.game.run();
