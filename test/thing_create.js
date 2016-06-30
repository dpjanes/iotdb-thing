/*
 *  thing_create.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-05
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

const assert = require("assert");
const thing = require("../thing");

const errors = require("iotdb-errors");

const model_file = path.join(__dirname, './things/thing-basement-heater/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

describe("thing", function() {
    describe("create", function() {
        describe("no arguments", function() {
            it("doesn't crash", function() {
                const thing_1 = thing.make()
            });
            it("has meta band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("meta"));
                assert.strictEqual(thing_1.band("meta").band_name(), "meta");
                assert.strictEqual(thing_1.band("meta").thing(), thing_1);
            });
            it("has model band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("model"));
                assert.strictEqual(thing_1.band("model").band_name(), "model");
                assert.strictEqual(thing_1.band("model").thing(), thing_1);
            });
            it("has istate band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("istate"));
                assert.strictEqual(thing_1.band("istate").band_name(), "istate");
                assert.strictEqual(thing_1.band("istate").thing(), thing_1);
            });
            it("has ostate band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("ostate"));
                assert.strictEqual(thing_1.band("ostate").band_name(), "ostate");
                assert.strictEqual(thing_1.band("ostate").thing(), thing_1);
            });
            it("has connection band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("connection"));
                assert.strictEqual(thing_1.band("connection").band_name(), "connection");
                assert.strictEqual(thing_1.band("connection").thing(), thing_1);
            });
        });
        describe("arguments", function() {
            it("non dictionary argument", function() {
                const thing_1 = thing.make({ x: 1 })

                assert.ok(!thing_1.band("x"));
            });
        });
        describe("helper function", function() {
            describe("reachable", function() {
                it("no connection", function() {
                    const thing_1 = thing.make();

                    assert.strictEqual(thing_1.reachable(), false);
                });
                it("reachable:false", function() {
                    const thing_1 = thing.make({
                        connection: { "iot:reachable": false },
                    });

                    assert.strictEqual(thing_1.reachable(), false);
                });
                it("reachable:true", function() {
                    const thing_1 = thing.make({
                        connection: { "iot:reachable": true },
                    });

                    assert.strictEqual(thing_1.reachable(), true);
                });
                it("reachable:weird", function() {
                    const thing_1 = thing.make({
                        connection: { "iot:reachable": "hello" },
                    });

                    assert.strictEqual(thing_1.reachable(), true);
                });
            });
            describe("thing-id", function() {
                it("no meta", function() {
                    const thing_1 = thing.make();

                    assert.strictEqual(thing_1.thing_id(), undefined);
                });
                it("meta", function() {
                    const thing_1 = thing.make({
                        meta: {
                            "iot:model-id": "some-model-id",
                            "iot:thing-id": "some-thing-id",
                        }
                    });

                    assert.strictEqual(thing_1.thing_id(), "some-thing-id");
                });
            });
            describe("model-id", function() {
                it("no meta", function() {
                    const thing_1 = thing.make();

                    assert.strictEqual(thing_1.model_id(), undefined);
                });
                it("meta", function() {
                    const thing_1 = thing.make({
                        meta: {
                            "iot:model-id": "some-model-id",
                            "iot:thing-id": "some-thing-id",
                        }
                    });

                    assert.strictEqual(thing_1.model_id(), undefined);
                });
                it("meta", function() {
                    const thing_1 = thing.make({
                        model: {
                            "iot:model-id": "some-model-id",
                        },
                        meta: {
                            "iot:thing-id": "some-thing-id",
                        }
                    });

                    assert.strictEqual(thing_1.model_id(), "some-model-id");
                });
            });
            describe("set", function() {
                it("promise success", function(done) {
                    const thing_1 = thing.make({
                        model: model_document,
                    });

                    const promise = thing_1.set("temperature", 0);
                    promise
                        .then((ud) => {
                            assert.deepEqual(ud, { "temperature": 0 });
                            done();
                        })
                        .catch((error) => {
                            done(error);
                        });
                });
                it("promise fail", function(done) {
                    const thing_1 = thing.make({
                        model: model_document,
                    });

                    const promise = thing_1.set("bad", 0);
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
            })
        });
    })
});
