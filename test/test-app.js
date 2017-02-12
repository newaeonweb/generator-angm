'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');

describe('angm:app', function () {
    before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
        .on('end', done());
    });

    it('creates root files', function () {
        assert.file([
            'package.json',
            'index.html',
            '.editorconfig',
            '.jshintrc',
            'README.md'
        ]);
    });
});
