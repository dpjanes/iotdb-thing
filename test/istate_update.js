/*
 *  istate_update.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-07
 *
 *  Copyright [2013-2016] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const iotdb = require("iotdb");
const _ = iotdb._;

const errors = require("iotdb-errors");

const assert = require("assert");
const thing = require("../thing");

const model_file = path.join(__dirname, './things/thing-basement-heater/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

const istate_file = path.join(__dirname, './things/thing-basement-heater/istate');
const istate_document = JSON.parse(fs.readFileSync(istate_file, 'utf-8'));

const istated = {
    "temperature": 20,
    "set-point": 21
};

describe("istate", function() {
    describe("update", function() {
        describe("general function", function() {
            it("promise success", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.update({
                    "temperature": 13
                });
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "temperature": 13, });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("promise fail", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.update({
                    "bad": 12,
                });
                promise
                    .then((ud) => {
                        assert(false, "shouldn't reach here");
                    })
                    .catch((error) => {
                        if (error instanceof errors.Invalid) {
                            return done();
                        }

                        done(error);
                    });
            });
            it("on (non-semantic)", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");
                istate_1.on("temperature", (_thing, _band, _value) => {
                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, istate_1);
                    assert.strictEqual(_value, 15);

                    done();
                });
                const promise = istate_1.update({
                    "temperature": 15,
                });
            });
            it("value change", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                assert.deepEqual(istate_1.state(), istated);
                const promise = istate_1.update({
                    "temperature": 13
                });
                assert.deepEqual(istate_1.state(), {
                    "temperature": 13,
                    "set-point": 21
                });
            });
            it("replace", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                assert.deepEqual(istate_1.state(), istated);
                const promise = istate_1.update({}, { replace: true })
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, {
                            "temperature": null,
                            "set-point": null,
                        });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            /*
             *  REVISIT THIS - make a new param called 'force' or something
            it("force bad value into array", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.update({
                    "bad": 12,
                }, {
                    validate: false,
                });
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, {
                            "bad": 12,
                        });
                        assert.deepEqual(istate_1.state(), {
                            "temperature": 20,
                            "set-point": 21,
                            "bad": 12,
                        });
                        done()
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
             */
        });
    });
});
