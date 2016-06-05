/*
 *  band_generic.js
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

describe("band - generic operations", function() {
    describe("create", function() {
        it("scratch band", function() {
            const thing_1 = thing.make({ scratch: {} })

            assert.ok(thing_1.band("scratch"));
            assert.strictEqual(thing_1.band("scratch").band(), "scratch");
            assert.strictEqual(thing_1.band("scratch").thing(), thing_1);
        });
    });
    describe("set", function() {
        it("empty at creation", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");

            assert.deepEqual(scratch_1.state(), {});
        });
        it("set once", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("name", "David");

            assert.deepEqual(scratch_1.state(), {
                "name": "David",
            });
        });
        it("set twice", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("name", "John");
            scratch_1.set("name", "Freddy");

            assert.deepEqual(scratch_1.state(), {
                "name": "Freddy",
            });
        });
        it("set two things", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("name", "Julie");
            scratch_1.set("age", 24);

            assert.deepEqual(scratch_1.state(), {
                "name": "Julie",
                "age": 24,
            });
        });
    });
    describe("on", function() {
        describe("thing", function() {
            it("emits on set", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                thing_1.on("scratch", function(_thing, _band, _changed) {
                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, "scratch");
                    assert.deepEqual(_changed, {
                        "name": "David",
                    });
                    done();
                });

                scratch_1.set("name", "David");
            });
            it("sets happen on nextTick", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                scratch_1.set("name", "John");

                thing_1.on("scratch", function(_thing, _band, _changed) {
                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, "scratch");
                    assert.deepEqual(_changed, {
                        "name": "John",
                    });
                    done();
                });
            });
            it("emits only the latest change in order", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                let count = 0;

                thing_1.on("scratch", function(_thing, _band, _changed) {

                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, "scratch");

                    if (count++ === 0) {
                        assert.deepEqual(_changed, {
                            "age": 52,
                        });
                    } else {
                        assert.deepEqual(_changed, {
                            "name": "John",
                        });
                        done();
                    }
                });

                scratch_1.set("age", 52);
                scratch_1.set("name", "John");
            });
            it("doesn't emit no change", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                let count = 0;

                thing_1.on("scratch", function(_thing, _band, _changed) {
                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, "scratch");

                    assert.deepEqual(_changed, {
                        "name": "Guido",
                    });
                    count++;
                });

                scratch_1.set("name", "Guido");
                scratch_1.set("name", "Guido");

                process.nextTick(function() {
                    assert.strictEqual(count, 1);
                    done();
                });
            });
            it("does emit two changes", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                let count = 0;

                thing_1.on("scratch", function(_thing, _band, _changed) {
                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, "scratch");

                    count++;
                });

                scratch_1.set("name", "Sandy");
                scratch_1.set("name", "Bottom");

                process.nextTick(function() {
                    assert.strictEqual(count, 2);
                    done();
                });
            });
        });
    });
});
