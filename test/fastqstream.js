'use strict'
var fs = require('fs')
var test = require('tape')

var FASTQStream = require('..')

test('FASTQStream: basic file', function (t) {
  var reader = fs.createReadStream('./test/test-data/basic.fq')

  t.plan(2)
  var records = []
  reader.pipe(new FASTQStream())
        .on('data', function (data) {
          t.equal(data['seq'].length, data['qual'].length,
                  'seq and qual have the same length')
          records.push(data)
        })
        .on('error', function () {
          t.fail()
        })
        .on('end', function () {
          t.equal(records.length, 1, 'only one record in file')
        })
})
