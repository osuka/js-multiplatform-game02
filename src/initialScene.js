/* globals cc */
(function () {
  'use strict';

  var ScreenDimensions = require('./screenDimensions');

  var InitialScene = cc.Scene.extend({
    ctor: function (mainLayerClass) {
      this._super();
  
      // save layer for later use
      this.mainLayerClass = mainLayerClass;
      cc.associateWithNative(this, cc.Scene);
  
      var winSize = cc.director.getWinSize();
  
      // update DPI
      cc.log('Window size: ' + winSize.width + 'x' + winSize.height);
      if (typeof cc.Device !== 'undefined') {
        cc.log('DPI: ' + cc.Device.getDPI());
        if (cc.Device.getDPI() < 150) {
          ScreenDimensions.scale = 1.0;
        } else if (cc.Device.getDPI() < 300) {
          ScreenDimensions.scale = 2.0;
        } else {
          ScreenDimensions.scale = 4.0;
        }
      }
      cc.log('FPS: ' + cc.director.getAnimationInterval());
      cc.director.setDisplayStats(true);
  
      cc.log('Scale set to: ' + ScreenDimensions.scale);
      ScreenDimensions.viewportSize = {
        height : winSize.height,
        width : winSize.width
      };
      cc.log('Adjusted size: ' +
          ScreenDimensions.viewportSize.width + 'x' +
          ScreenDimensions.viewportSize.height);
    },
  
    onEnter: function () {
      this._super();
      var layer = new this.mainLayerClass();
      this.addChild(layer);
      layer.init();
    }
  });
  
  module.exports = InitialScene;
})();
