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
        it("set ignore @ values", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");
            scratch_1.set("@name", "David");
            scratch_1.set("name", "John");

            assert.deepEqual(scratch_1.state(), {
                "name": "John",
            });
        });
    });
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
    describe("update / state", function() {
        describe("works", function() {
            it("empty", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {};
                const was_updated = scratch_1.update(d);
                assert.deepEqual(scratch_1.state(), d);
                assert.ok(!was_updated);
            });
            it("one value", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {
                    "name": "Sandy Bottom",
                };
                const was_updated = scratch_1.update(d);
                assert.deepEqual(scratch_1.state(), d);
                assert.ok(was_updated);
            });
            it("multiple value", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {
                    "name": "Sponge Bob",
                    "friend": "Sandy Bottom",
                };
                const was_updated = scratch_1.update(d);
                assert.deepEqual(scratch_1.state(), d);
                assert.ok(was_updated);
            });
            it("change value", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const was_updated_1 = scratch_1.update({
                    "name": "Sponge Bob",
                    "friend": "Sandy Bottom",
                });
                const was_updated_2 = scratch_1.update({
                    "another friend": "Patrick Star",
                });
                assert.deepEqual(scratch_1.state(), {
                    "name": "Sponge Bob",
                    "friend": "Sandy Bottom",
                    "another friend": "Patrick Star",
                });
                assert.ok(was_updated_1);
                assert.ok(was_updated_2);
            });
            it("ignores @ values", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");

                const d = {
                    "@something": "Bla",
                    "@else": "Blurg",
                    "name": "Sandy Bottom",
                };
                const was_updated = scratch_1.update(d);
                assert.deepEqual(scratch_1.state(), {
                    "name": "Sandy Bottom",
                });
                assert.ok(was_updated);
            });
        });
        describe("emits", function() {
            describe("model", function() {
            });
            describe("thing", function() {
                it("works on nextTick", function(done) {
                    const thing_1 = thing.make({ scratch: {} })
                    const scratch_1 = thing_1.band("scratch");

                    const d = {
                        "name": "Sponge Bob",
                        "friend": "Sandy Bottom",
                    };
                    const was_updated = scratch_1.update(d);

                    thing_1.on("scratch", function(_thing, _band, _changed) {
                        assert.strictEqual(_thing, thing_1);
                        assert.strictEqual(_band, "scratch");

                        assert.deepEqual(_changed, d);
                        done();
                    });
                    assert.ok(was_updated);
                });
                it("can be turned off", function(done) {
                    const thing_1 = thing.make({ scratch: {} })
                    const scratch_1 = thing_1.band("scratch");

                    const d = {
                        "name": "Johnny",
                    };
                    const was_updated = scratch_1.update(d, {
                        notify: false,
                    });

                    thing_1.on("scratch", function(_thing, _band, _changed) {
                        assert.ok(false);
                    });

                    assert.deepEqual(scratch_1.state(), d);
                    assert.ok(was_updated);
                    process.nextTick(done);
                });
            });
        });
    });
    describe("timestamp", function() {
        it("epoch timestamp at creation", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");

            assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
        });
        describe("update", function() {
            it("updates timestamp if change", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                scratch_1.set("name", "David");
                assert.ok(scratch_1.timestamp() >= now, "timestamp did not advance");
            });
            it("does not update timestamp if no change", function() {
                const thing_1 = thing.make({ scratch: { "name": "David" } })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                scratch_1.set("name", "David");
                assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
            });
        });
        describe("update", function() {
            it("updates timestamp if change", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated = scratch_1.update({
                    "name": "Joanne",
                });
                assert.ok(was_updated);
                assert.ok(scratch_1.timestamp() >= now, "timestamp did not advance");
            });
            it("does not update timestamp if no change", function() {
                const thing_1 = thing.make({ scratch: { "name": "David" } })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated = scratch_1.update({
                    "name": "David",
                });
                assert.ok(!was_updated);
                assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
            });
            it("optional don't update timestamp", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated = scratch_1.update({
                    "name": "Joanne",
                }, {
                    add_timestamp: false,
                });
                assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
            });
            it("use @timestamp", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
                assert.ok(was_updated);
            });
            it("use @timestamp ... with option to ignore it!", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: false,
                });
                assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
                assert.ok(was_updated);
            });
            it("use @timestamp ( old, new ) - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                assert.ok(was_updated_1);
                assert.ok(was_updated_2);
                assert.strictEqual(scratch_1.timestamp(), TS_NEW);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( old, old ) - expect NO update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                assert.ok(was_updated_1);
                assert.ok(!was_updated_2);
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
            });
            it("use @timestamp ( new, old ) - expect NO update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                assert.ok(was_updated_1);
                assert.ok(!was_updated_2);
                assert.strictEqual(scratch_1.timestamp(), TS_NEW);
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
            });
            it("use @timestamp ( new, null ) - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                assert.ok(was_updated_1);
                assert.ok(was_updated_2);
                assert.ok(scratch_1.timestamp() >= now, "timestamp did not advance");
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( null, new ) - expect NO update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                assert.ok(was_updated_1);
                assert.ok(!was_updated_2);
                assert.ok(scratch_1.timestamp() >= now, "timestamp did not advance");
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
            });
            it("use @timestamp ( old, old ) with NO CHECK - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                    check_timestamp: false,
                });
                assert.ok(was_updated_1);
                assert.ok(was_updated_2);
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( new, old ) with NO CHECK - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                    check_timestamp: false,
                });
                assert.ok(was_updated_1);
                assert.ok(was_updated_2);
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( null, new ) with NO CHECK - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const was_updated_1 = scratch_1.update({
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const was_updated_2 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "David",
                }, {
                    add_timestamp: true,
                    check_timestamp: false,
                });
                assert.ok(was_updated_1);
                assert.ok(was_updated_2);
                assert.strictEqual(scratch_1.timestamp(), TS_NEW);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
        });
    });
});
