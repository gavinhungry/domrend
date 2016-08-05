/**
 * domrend - Render DOM elements to PNG
 * https://github.com/gavinhungry/domrend
 */

(function() {
 'use strict';

  var system = require('system');
  var webpage = require('webpage');
  var validUrl = require('valid-url');

  var content = system.args[1];
  var selector = system.args[2];
  var zoom = system.args[3];
  var width = system.args[4];
  var height = system.args[5];

  var page = webpage.create();

  page.viewportSize = {
    width: width,
    height: height
  };

  var render = function() {
    page.zoomFactor = zoom;

    var clipRect = page.evaluate(function(selector) {
      return document.querySelector(selector).getBoundingClientRect();
    }, selector);

    if (!clipRect) {
      phantom.exit(1);
    }

    page.clipRect = {
      top: clipRect.top * page.zoomFactor,
      left: clipRect.left * page.zoomFactor,
      width: clipRect.width * page.zoomFactor,
      height: clipRect.height * page.zoomFactor
    };

    var data = page.renderBase64('PNG');
    if (data) {
      console.log(JSON.stringify({
        width: page.clipRect.width,
        height: page.clipRect.height,
        data: data
      }));
    }

    phantom.exit();
  };

  if (validUrl.isWebUri(content)) {
    page.open(content, function(status) {
      if (status !== 'success') {
        phantom.exit(2);
      }

      render();
    });
  } else {
    page.content = content;
    render();
  }

})();
