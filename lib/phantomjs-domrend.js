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
  var width = Number(system.args[3]);
  var vWidth = system.args[4];
  var vHeight = system.args[5];

  var page = webpage.create();

  page.viewportSize = {
    width: vWidth,
    height: vHeight
  };

  var getClipRect = function() {
    return page.evaluate(function(selector) {
      return document.querySelector(selector).getBoundingClientRect();
    }, selector);
  };

  var render = function() {
    var clipRect = getClipRect();

    if (!clipRect) {
      phantom.exit(2);
    }

    page.zoomFactor = width ? width / (clipRect.width * page.zoomFactor) : 1;

    clipRect = getClipRect();

    page.clipRect = {
      top: clipRect.top * page.zoomFactor,
      left: clipRect.left * page.zoomFactor,
      width: clipRect.width * page.zoomFactor,
      height: clipRect.height * page.zoomFactor
    };

    var base64 = page.renderBase64('PNG');
    if (!base64) {
      phantom.exit(3);
    }

    console.log(base64);

    phantom.exit();
  };

  if (validUrl.isWebUri(content)) {
    page.open(content, function(status) {
      if (status !== 'success') {
        phantom.exit(1);
      }

      render();
    });
  } else {
    page.content = content;
    render();
  }

})();
