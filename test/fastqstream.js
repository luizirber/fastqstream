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

test('FASTQStream: basic validation', function (t) {
  var reader = fs.createReadStream('./test/test-data/basic.fq')

  t.plan(2)
  var records = []
  reader.pipe(new FASTQStream({validate: true}))
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

test('FASTQStream: validation error', function (t) {
  var reader = fs.createReadStream('./test/test-data/wrong_length.fq')

  t.plan(1)
  reader.pipe(new FASTQStream({validate: true}))
        .on('error', function (err) {
          if (err) {
            t.pass(err)
          }
        })
})
