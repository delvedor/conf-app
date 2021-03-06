'use strict'

const minimist = require('minimist')
const Hapi = require('hapi')

function build (opts, cb) {
  const server = new Hapi.Server()

  cb = cb || noop

  server.connection({ port: opts.port })

  server.register([
    require('./lib/talks')
  ], (err) => {
    cb(err, server)
  })

  return server
}

function noop (err) {
  if (err) {
    throw err
  }
}

module.exports = build

function start (opts, cb) {
  build(opts, (err, server) => {
    if (err) return cb(err)

    server.start((err) => {
      cb(err, server)
    })
  })
}

module.exports.start = start

if (require.main === module) {
  start(minimist(process.argv.slice(2), {
    integer: ['port'],
    alias: {
      port: 'p'
    },
    default: {
      port: 3000
    }
  }), (err, server) => {
    if (err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })
}
