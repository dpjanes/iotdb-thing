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

const assert = require("assert");
const thing = require("../thing");

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
            describe("thing-id", function() {
                it("no meta", function() {
                    const thing_1 = thing.make();

                    assert.strictEqual(thing_1.thing_id(), null);
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

                    assert.strictEqual(thing_1.model_id(), null);
                });
                it("meta", function() {
                    const thing_1 = thing.make({
                        meta: {
                            "iot:model-id": "some-model-id",
                            "iot:thing-id": "some-thing-id",
                        }
                    });

                    assert.strictEqual(thing_1.model_id(), "some-model-id");
                });
            });
            describe("set", function() {
                const thing_1 = thing.make();
                const ostate_1 = thing_1.band("ostate");

                assert.strictEqual(ostate_1.get("on", null), null);
                thing_1.set("on", true);
                console.log(ostate_1.state());
                assert.strictEqual(ostate_1.get("on", null), true);
            });
        });
    })
});
