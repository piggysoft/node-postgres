var helper = require(__dirname + "/test-helper");
var pg = helper.pg;

test('should return insert metadata', function() {
  pg.connect(helper.config, assert.calls(function(err, client, done) {
    assert.isNull(err);

    helper.versionGTE(client, '9.0.0', assert.success(function(hasRowCount) {
      client.query("CREATE TEMP TABLE zugzug(name varchar(10))", assert.calls(function(err, result) {
        assert.isNull(err);
        assert.equal(result.oid, null);
        assert.equal(result.command, 'CREATE');

        var q = client.query("INSERT INTO zugzug(name) VALUES('more work?')", assert.calls(function(err, result) {
          assert.isNull(err);
          assert.equal(result.command, "INSERT");
          assert.equal(result.rowCount, 1);

          client.query('SELECT * FROM zugzug', assert.calls(function(err, result) {
            assert.isNull(err);
            if(hasRowCount) assert.equal(result.rowCount, 1);
            assert.equal(result.command, 'SELECT');
            process.nextTick(pg.end.bind(pg));
          }));
        }));

        assert.emits(q, 'end', function(result) {
          assert.equal(result.command, "INSERT");
          if(hasRowCount) assert.equal(result.rowCount, 1);
          done();
        });

      }));
    }));
  }));
});
