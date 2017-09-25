# fastqstream

> **fastqstream** is a Stream transform for parsing FASTQ files into records.

[![License](https://img.shields.io/github/license/luizirber/fastqstream.svg?style=flat-square)](https://raw.githubusercontent.com/luizirber/fastqstream/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/fastqstream.svg?style=flat-square)](https://www.npmjs.org/package/fastqstream)
[![Build Status](https://img.shields.io/travis/luizirber/fastqstream.svg?style=flat-square)](https://travis-ci.org/luizirber/fastqstream)
[![Coverage Status](https://img.shields.io/codecov/c/github/luizirber/fastqstream/master.svg?style=flat-square)](https://codecov.io/github/luizirber/fastqstream)
[![Dependencies Status](https://img.shields.io/david/luizirber/fastqstream.svg?style=flat-square)](https://david-dm.org/luizirber/fastqstream#info=dependencies)
[![devDependencies Status](https://img.shields.io/david/dev/luizirber/fastqstream.svg?style=flat-square)](https://david-dm.org/luizirber/fastqstream#info=devDependencies)
[![Code Climate](https://img.shields.io/codeclimate/github/luizirber/fastqstream.svg?style=flat-square)](https://codeclimate.com/github/luizirber/fastqstream)
[![NPM downloads per month](https://img.shields.io/npm/dm/fastqstream.svg?style=flat-square)](https://www.npmjs.org/package/fastqstream)
[![GitHub issues](https://img.shields.io/github/issues/luizirber/fastqstream.svg?style=flat-square)](https://github.com/luizirber/fastqstream/issues)
[![Greenkeeper badge](https://badges.greenkeeper.io/luizirber/fastqstream.svg)](https://greenkeeper.io/)

## Usage

```js
var fs = require('fs')

var reader = fs.createReadStream('file.fq')

reader.pipe(new FASTQStream())
      .on('data', function (data) {
	    console.log(data)
	  })
```

## Available transforms

There are two transforms available:

- FASTQStream takes a String or Buffer and convert into Records (as objects).
  It does some basic validation on the syntax,
  but doesn't try to verify if quality scores are valid,
  for example.
- FASTQValidator implements more strict validation,
  such as checking that no sequence in the original FASTQ has the same `id` as
  other sequences.

## Alternatives

I checked for FASTQ parsers on NPM but none had all the features that I wanted.
They are all very interesting,
but I wanted something that works on any stream and is agnostic about nodejs or browser.
Most of them implement the parser as a Readable stream (expecting a path,
which it then opens with `fs`),
but I think it is better to implement it as a Transform and consume data from whatever is piping data in.

- https://www.npmjs.com/package/fasta-tools
- https://www.npmjs.com/package/fqreader
- https://www.npmjs.com/package/bionode-fastq
- https://www.npmjs.com/package/streaming-sequence-extractor
  Focuses on GenBank files, but many nice ideas here.

## License

BSD 3-clause
