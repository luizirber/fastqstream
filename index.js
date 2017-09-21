'use strict'
const Transform = require('readable-stream/transform')

class FASTQStream extends Transform {
  constructor (options) {
    var validate = false
    if (!options) {
      options = {}
    }
    if (options.validate) {
      validate = true
      delete options.validate
    }
    if (!options.highWaterMark) {
      options.highWaterMark = 16
    }
    options.objectMode = true

    super(options)

    this._rawbuf = ''
    this.block = []
    this.validate = validate
  }

  validateRecord (record) {
    var valid = true

    if (record['seq'].length !== record['qual'].length) {
      this.emit('error', 'sequence and quality length are different in record ' + record['name'])
    }

    return valid
  }

  _processFASTQ (last) {
    var lines = this._rawbuf.split(/\r?\n/)
    var i = 0

    for (i = 0; i < lines.length - 1; i++) {
      this.block.push(lines[i])
      if (this.block.length === 4) {
        var record = ({
          name: this.block[0],
          seq: this.block[1],
          name2: this.block[2],
          qual: this.block[3]
        })

        var valid = true

        if (this.validate) {
          valid = this.validateRecord(record)
        }

        if (valid) {
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

module.exports = FASTQStream
