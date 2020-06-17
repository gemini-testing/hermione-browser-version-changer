'use strict';

const chai = require('chai');
const sinon = require('sinon');

global.sinon = sinon;
global.assert = chai.assert;

sinon.assert.expose(chai.assert, {prefix: ''});
