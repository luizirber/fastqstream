'use strict'
const Transform = require('readable-stream/transform')

class FASTQStream extends Transform {
  constructor (options) {
    if (!options) {
      options = {}
    }
    if (!options.highWaterMark) {
      options.highWaterMark = 16
    }
    options.objectMode = true

    super(options)

    this._rawbuf = ''
    this.block = []
  }

  basicValidation (record) {
    var valid = true
    if (record['seq'].length !== record['qual'].length) {
      this.emit('error', 'sequence and quality length should be the same in record ' + record['name'])
      valid = false
    }
    if (record['name'].slice(0, 1) !== '@') {
      this.emit('error', 'sequence header must start with "@" in record ' + record['name'])
      valid = false
    }
    if (record['name2'].slice(0, 1) !== '+') {
      this.emit('error', 'sequence header must start with "@" in record ' + record['name'])
      valid = false
    }
    if (record['name'].slice(1) !== record['name2'].slice(1) &&
        record['name2'].slice(1).length !== 0) {
      this.emit('error', 'name2 must be empty or match name in record ' + record['name'])
      valid = false
    }
    return valid
  }

  _processFASTQ (last) {
    var lines = this._rawbuf.split(/\r?\n/)
    var i = 0

    for (i = 0; i < lines.length - 1; i++) {
      this.block.push(lines[i])
      if (this.block.length === 4) {
        var record = {
          name: this.block[0],
          seq: this.block[1],
          name2: this.block[2],
          qual: this.block[3]
        }
        if (this.basicValidation(record)) {
          this.push(record)
        }
        this.block = []
      }
    }

    if (!last) {
      this._rawbuf = lines[lines.length - 1] || ''
    } else if (lines.length && lines[lines.length - 1].length) {
      // TODO: fix this
      // this._processLine(lines[lines.length - 1])
    }
  }

  _transform (chunk, enc, callback) {
    this._rawbuf += chunk.toString('utf8')
    this._processFASTQ()
    callback()
  }

  _flush (callback) {
    this._processFASTQ(true)
    callback()
  }
}

class FASTQValidator extends Transform {
  constructor (options) {
    if (!options) {
      options = {}
    }
    if (!options.highWaterMark) {
      options.highWaterMark = 16
    }
    options.objectMode = true

    super(options)
  }

  validateRecord (record) {
    var valid = true

    if (record['seq'].length !== record['qual'].length) {
      this.emit('error', 'sequence and quality length should be the same in record ' + record['name'])
      valid = false
    }
    if (record['name'].slice(0, 1) !== '@') {
      this.emit('error', 'sequence header must start with "@" in record ' + record['name'])
      valid = false
    }
    if (record['name2'].slice(0, 1) !== '+') {
      this.emit('error', 'sequence header must start with "@" in record ' + record['name'])
      valid = false
    }
    if (record['name'].slice(1) !== record['name2'].slice(1) &&
        record['name2'].slice(1).length !== 0) {
      this.emit('error', 'name2 must be empty or match name in record ' + record['name'])
      valid = false
    }

    return valid
  }

  _transform (record, enc, callback) {
    if (this.validateRecord(record)) {
      this.push(record)
    }
    callback()
  }

  _flush (callback) {
    callback()
  }
}

module.exports = {
  FASTQStream: FASTQStream,
  FASTQValidator: FASTQValidator
}
