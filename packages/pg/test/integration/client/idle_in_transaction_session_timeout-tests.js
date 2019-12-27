'use strict'
var helper = require('./test-helper')
var Client = helper.Client

var suite = new helper.Suite()

var conInfo = helper.config

function getConInfo (override) {
  return Object.assign({}, conInfo, override )
}

function getIdleTransactionSessionTimeout (conf, cb) {
  var client = new Client(conf)
  client.connect(assert.success(function () {
    client.query('SHOW idle_in_transaction_session_timeout', assert.success(function (res) {
      var timeout = res.rows[0].idle_in_transaction_session_timeout
      cb(timeout)
      client.end()
    }))
  }))
}

if (!helper.args.native) { // idle_in_transaction_session_timeout is not supported with the native client
  suite.test('No default idle_in_transaction_session_timeout ', function (done) {
    getConInfo()
    getIdleTransactionSessionTimeout({}, function (res) {
      assert.strictEqual(res, '0') // 0 = no timeout
      done()
    })
  })

  suite.test('idle_in_transaction_session_timeout integer is used', function (done) {
    var conf = getConInfo({
      'idle_in_transaction_session_timeout': 3000
    })
    getIdleTransactionSessionTimeout(conf, function (res) {
      assert.strictEqual(res, '3s')
      done()
    })
  })

  suite.test('idle_in_transaction_session_timeout float is used', function (done) {
    var conf = getConInfo({
      'idle_in_transaction_session_timeout': 3000.7
    })
    getIdleTransactionSessionTimeout(conf, function (res) {
      assert.strictEqual(res, '3s')
      done()
    })
  })

  suite.test('idle_in_transaction_session_timeout string is used', function (done) {
    var conf = getConInfo({
      'idle_in_transaction_session_timeout': '3000'
    })
    getIdleTransactionSessionTimeout(conf, function (res) {
      assert.strictEqual(res, '3s')
      done()
    })
  })

}