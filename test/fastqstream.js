'use strict'
var fs = require('fs')
var test = require('tape')

var {FASTQStream, FASTQValidator} = require('../')

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

test('FASTQStream: basic validation in file with errors', function (t) {
  var reader = fs.createReadStream('./test/test-data/wrong_length.fq')

  t.plan(1)
  reader.pipe(new FASTQStream())
        .on('data', function () {})
        .on('error', function (err) {
          if (err) {
            t.pass(err)
          }
        })
        .on('end', function () {
          t.fail('Invalid file, should throw an error')
        })
})

test('FASTQValidator: validation error', function (t) {
  var reader = fs.createReadStream('./test/test-data/wrong_length.fq')

  t.plan(1)
  reader.pipe(new FASTQStream())
        .on('error', function (err) {
          if (err) {
            t.pass(err)
          }
        })
        .pipe(new FASTQValidator())
        .on('error', function (err) {
          if (err) {
            t.pass(err)
          }
        })
})
