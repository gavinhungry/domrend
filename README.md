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
      -w, --width <WIDTH>          render width
      -v  --viewport <DIMENSIONS>  viewport width and height
      -d, --directory <DIR>        output directory
      -f, --filename <NAME>        output filename

#### Examples

```shell
$ domrend -c logo.html -s '#logo' -w 512
```

```shell
$ domrend -c https://www.w3.org -s '#w3c_most-recently'
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
  width: 192 // requested render width, may not work with responsive design
}).then(function(data) {
  // 'iVBORw0KGgoAAAANSUhEUgAAA...'
}, function(err) {
  // an error occurred
});
```

#### Render to file

```javascript
domrend.renderToFile({
  content: 'http://example.com/page.html',
  selector: '#logo',
  viewport: {
    width: 1024,
    height: 800
  },

  // options specific to renderToFile
  dir: '/path/to/output/dir',
  output: 'foo.png' // output filename, default is 'domrend.png'
}).then(function(filePath) {
  // '/path/to/output/dir/foo.png'
}, function(err) {
  // an error occurred
});
```

License
-------
This software is released under the terms of the **MIT license**. See `LICENSE`.
