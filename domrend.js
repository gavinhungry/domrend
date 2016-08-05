/**
 * domrend - Render DOM elements to PNG
 * https://github.com/gavinhungry/domrend
 */

(function() {
  'use strict';

  var fs = require('fs');
  var path = require('path');
  var phantomjs = require('phantomjs-prebuilt');

  var domrend = module.exports;
  var scriptPath = path.join(__dirname, 'lib', 'phantomjs-domrend.js');

  /**
   * Render a DOM element to base64-encoded PNG
   *
   * @param {String} opts.content - page markup or URL
   * @param {String} [opts.selector] - selector to element
   * @param {Number} [opts.width] - render width
   * @param {Object} [opts.viewport] - viewport width and height
   *
   * @return {Promise}
   */
  domrend.render = function(opts) {
    opts = opts || {};
    if (!opts.content) {
      return Promise.reject(new Error('No content provided'));
    }

    var selector = opts.selector || 'body';
    var width = Number(opts.width) || 0;

    var viewport = opts.viewport || {};
    viewport.width = Number(viewport.width) || 1280;
    viewport.height = Number(viewport.height) || 800;

    return new Promise(function(res, rej) {
      var program = phantomjs.exec(scriptPath,
        opts.content, selector, width, viewport.width, viewport.height);

      var data = '';
      program.stdout.on('data', function(chunk) {
        data += chunk;
      });

      program.on('exit', function(code) {
        if (code === 1) {
          return rej(new Error('Could not load content'));
        }

        if (code === 2) {
          return rej(new Error('Element not found'));
        }

        if (code === 3) {
          return rej(new Error('Render failed'));
        }

        res(data);
      });
    });
  };

  /**
   * Render a DOM element to PNG file(s)
   *
   * @param {Object} opts
   * @param {String} opts.content - page markup or URL
   * @param {String} [opts.selector] - selector to element
   * @param {Number} [opts.width] - render width
   * @param {Object} [opts.viewport] - viewport width and height
   * @param {Array} [opts.dir] - relative output directory
   * @param {String} [opts.filename] - output filename, defaults to 'domrend.png'
   *
   * @return {Promise}
   */
  domrend.renderToFile = function(opts) {
    return domrend.render(opts).then(function(data) {
      return new Promise(function(res, rej) {
        var dirPath = path.resolve(opts.dir || '');
        var filePath = path.join(dirPath, opts.filename || 'domrend.png');

        fs.writeFile(filePath, data, 'base64', function(err) {
          if (err) {
            return rej(err);
          }

          res(filePath);
        });
      });
    });
  };

})();
