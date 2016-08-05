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
   * @param {Number|Array} [opts.zoom] - zoom scales(s)
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
    var zooms = Array.isArray(opts.zoom) ? opts.zoom : [opts.zoom];
    var viewport = opts.viewport || {};
    viewport.width = Number(viewport.width) || 1280;
    viewport.height = Number(viewport.height) || 800;

    var promises = zooms.map(function(zoom) {
      zoom = Number(zoom) || 1;

      return new Promise(function(res, rej) {
        var program = phantomjs.exec(scriptPath,
          opts.content, selector, zoom, viewport.width, viewport.height);

        var data = '';
        program.stdout.on('data', function(chunk) {
          data += chunk;
        });

        program.on('exit', function(code) {
          if (code === 1) {
            return rej(new Error('Element not found'));
          }

          if (code === 2) {
            return rej(new Error('Could not load content'));
          }

          var img = JSON.parse(data);
          res(img);
        });
      });
    });

    return Promise.all(promises);
  };

  /**
   * Render a DOM element to PNG file(s)
   *
   * @param {Object} opts
   * @param {String} opts.content - page markup or URL
   * @param {String} [opts.selector] - selector to element
   * @param {Number|Array} [opts.zoom] - zoom scales(s)
   * @param {Object} [opts.viewport] - viewport width and height
   * @param {Array} [opts.directory] - relative output directory
   * @param {String} [opts.output] - output filename, defaults to 'img'
   *
   * @return {Promise}
   */
  domrend.renderToFile = function(opts) {
    var outputPath = path.resolve(opts.directory || '');
    var output = opts.output ? opts.output.replace(/\.png$/i, '') : 'img';

    return domrend.render(opts).then(function(imgs) {
      return imgs.map(function(img) {
        return new Promise(function(res, rej) {
          var filename = output + (imgs.length > 1 ? '-' + img.width : '') + '.png';
          var file = path.join(outputPath, filename);

          fs.writeFile(file, img.data, 'base64', function(err) {
            if (err) {
              return rej(err);
            }

            res({
              width: img.width,
              file: file
            });
          });
        });
      });
    }).then(function(promises) {
      return Promise.all(promises);
    });
  };

})();
