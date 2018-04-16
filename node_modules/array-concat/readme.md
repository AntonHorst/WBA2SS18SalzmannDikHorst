# array-concat
> Returns a new array comprised of the given array's contents with the given value appended.

[![Build Status](http://img.shields.io/travis/wilmoore/array-concat.js.svg)](https://travis-ci.org/wilmoore/array-concat.js) [![Code Climate](https://codeclimate.com/github/wilmoore/array-concat.js/badges/gpa.svg)](https://codeclimate.com/github/wilmoore/array-concat.js) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

```shell
npm install array-concat --save
```

> You can also use Duo, Bower or [download the files manually](https://github.com/wilmoore/array-concat.js/releases).

###### npm stats

[![npm](https://img.shields.io/npm/v/array-concat.svg)](https://www.npmjs.org/package/array-concat) [![NPM downloads](http://img.shields.io/npm/dm/array-concat.svg)](https://www.npmjs.org/package/array-concat) [![David](https://img.shields.io/david/wilmoore/array-concat.js.svg)](https://david-dm.org/wilmoore/array-concat.js)

## Overview

Returns a new array comprised of the given array's contents with the given value appended. Pass an array as the second argument to append multiple values.

## API Example

###### Pointful

```js
var concat = require('array-concat')
concat(['a', 'b'], ['c', 'd'])
//=> ['a', 'b', 'c', 'd']
```

###### Pointfree Style

```js
var concat = require('array-concat')
var list = [['b'], ['c'], ['d']]

list.map(concat(['a']))
//=> [['a', 'b'], ['a', 'c'], ['a', 'd']]
```

## API

### `concat(list, value)`

###### arguments

 - `list (array)`.
 - `value (any)`.

###### returns

 - `(array)` Returns an array comprised of the given array's contents with the given value(s) appended.

## Related

 - [Array.prototype.concat]

## Alternatives

 - [R.concat]

## Contributing

> SEE: [contributing.md](contributing.md)

## Licenses

[![GitHub license](https://img.shields.io/github/license/wilmoore/array-concat.js.svg)](https://github.com/wilmoore/array-concat.js/blob/master/license)

[Array.prototype.concat]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat
[R.concat]: http://ramdajs.com/0.19.0/docs/#concat
