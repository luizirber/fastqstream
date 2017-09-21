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

  _processFASTQ (last) {
    var lines = this._rawbuf.split(/\r?\n/)
    var i = 0

    for (i = 0; i < lines.length - 1; i++) {
      this.block.push(lines[i])
      if (this.block.length === 4) {
        this.push({
          name: this.block[0],
          seq: this.block[1],
          name2: this.block[2],
          qual: this.block[3]
        })
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
  }

  _transform (record, enc, callback) {
    var valid = true

    if (record['seq'].length !== record['qual'].length) {
      this.emit('error', 'sequence and quality length are different in record ' + record['name'])
    }

    if (valid) {
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
