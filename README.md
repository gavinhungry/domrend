domrend
=======
Render a DOM element to PNG.

Installation
------------

    $ npm install domrend

Usage
-----

### Command Line

    Usage:  [options]

    Options:

      -h, --help                   output usage information
      -V, --version                output the version number
      -c, --content <FILE|URL>     path or URL to document
      -s, --selector <SELECTOR>    selector to element
      -z, --zoom <ZOOM>            zoom scale
      -v  --viewport <DIMENSIONS>  viewport width and height
      -d, --directory <DIR>        output directory
      -o, --output <NAME>          output filename

#### Examples

```shell
$ domrend -c page.html -s '#logo' -v 640x480
```

```shell
$ domrend -c https://www.w3.org -s '#w3c_most-recently' -z 0.5
```

### Module

```javascript
var domrend = require('domrend');
```

#### Render to Base64

The only required option is `content`.

```javascript
domrend.render({
  content: fs.readFileSync('page.html'), // can also be a URL
  selector: '#logo', // element to select, defaults to body
  zoom: 1.5 // zoom factor(s), eg. [1.5, 2]
}).then(function(imgs) {
  /*
  [{
    width: 64,
    height: 64,
    data: // base-64 encoded PNG
  }, ...]
  */
}, function(err) {
  // an error occurred
});
```

#### Render to file

```javascript
domrend.renderToFile({
  content: 'http://example.com/page.html',
  selector: '#logo',
  zoom: [1.5, 2],

  // options specific to renderToFile
  dir: '/path/to/output/dir',
  output: 'foo' // filename, default is 'img'
}).then(function(imgs) {
  /*
  [{
    width: 128,
    height: 64,
    file: '/path/to/output/dir/foo-128.png'
  }, ...]
  */
}, function(err) {
  // an error occurred
});
```

License
-------
This software is released under the terms of the **MIT license**. See `LICENSE`.
