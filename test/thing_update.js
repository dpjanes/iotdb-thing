/*
 *  thing_update.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-23
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

const iotdb = require("iotdb");
const _ = iotdb._;

const assert = require("assert");
const thing = require("../thing");

describe("band - generic operations", function() {
    describe("update / state", function() {
        describe("works", function() {
            it("empty", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {};
                const update_promise = thing_1.update("scratch", d);
                assert.deepEqual(thing_1.state("scratch"), d);

                update_promise
                    .then((ud) => {
                        assert.deepEqual(d, ud);
                        done();
                    });
            });
            it("one value", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {
                    "name": "Sandy Bottom",
                };
                const update_promise = thing_1.update("scratch", d);
                assert.deepEqual(thing_1.state("scratch"), d);

                update_promise
                    .then((ud) => {
                        assert.deepEqual(d, ud);
                        done();
                    });
            });
            it("multiple value", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {
                    "name": "Sponge Bob",
                    "friend": "Sandy Bottom",
                };
                const update_promise = thing_1.update("scratch", d);
                assert.deepEqual(thing_1.state("scratch"), d);

                update_promise
                    .then((ud) => {
                        assert.deepEqual(d, ud);
                        done();
                    });
            });
            it("change value", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const update_promise_1 = thing_1.update("scratch", {
                    "name": "Sponge Bob",
                    "friend": "Sandy Bottom",
                });
                const update_promise_2 = thing_1.update("scratch", {
                    "another friend": "Patrick Star",
                });
                assert.deepEqual(thing_1.state("scratch"), {
                    "name": "Sponge Bob",
                    "friend": "Sandy Bottom",
                    "another friend": "Patrick Star",
                });
                // assert.ok(update_promise_1);
                // assert.ok(update_promise_2);
            });
            it("ignores @ values", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {
                    "@something": "Bla",
                    "@else": "Blurg",
                    "name": "Sandy Bottom",
                };
                const update_promise = thing_1.update("scratch", d);
                assert.deepEqual(thing_1.state("scratch"), {
                    "name": "Sandy Bottom",
                });
                // assert.ok(update_promise);
            });
        });
        describe("emits", function() {
            describe("band", function() {
            });
            describe("thing", function() {
                it("works on nextTick", function(done) {
                    const thing_1 = thing.make({ scratch: {} })
                    const scratch_1 = thing_1.band("scratch");

                    const d = {
                        "name": "Sponge Bob",
                        "friend": "Sandy Bottom",
                    };
                    const update_promise = thing_1.update("scratch", d);

                    thing_1.on("scratch", function(_thing, _band, _changed) {
                        assert.strictEqual(_thing, thing_1);
                        assert.strictEqual(_band, scratch_1);

                        assert.deepEqual(_changed, [ "name", "friend" ]);
                        done();
                    });
                    // assert.ok(update_promise);
                });
            });
        });
    });
});
