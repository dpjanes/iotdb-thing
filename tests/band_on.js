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

const iotdb = require("iotdb");
const _ = iotdb._;

const assert = require("assert");
const thing = require("../thing");

const TS_OLD = '2010-03-25T21:28:43.613Z';
const TS_NEW = '2012-03-25T21:28:43.613Z';
const TS_FUTURE = '2299-03-25T21:28:43.613Z';

describe("band", function() {
    describe("on", function() {
        describe("model", function() {
        });
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