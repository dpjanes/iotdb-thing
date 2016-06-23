/*
 *  band_timestamp.js
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
const errors = require("iotdb-errors");

const assert = require("assert");
const thing = require("../thing");

const TS_OLD = '2010-03-25T21:28:43.613Z';
const TS_NEW = '2012-03-25T21:28:43.613Z';
const TS_FUTURE = '2299-03-25T21:28:43.613Z';

describe("band", function() {
    describe("timestamp", function() {
        it("epoch timestamp at creation", function() {
            const thing_1 = thing.make({ scratch: {} })
            const scratch_1 = thing_1.band("scratch");

            assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
        });
        describe("set", function() {
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

                const update_promise = scratch_1.update({
                    "name": "Joanne",
                });
                // assert.ok(update_promise);
                assert.ok(scratch_1.timestamp() >= now, "timestamp did not advance");
            });
            it("does not update timestamp if no change", function() {
                const thing_1 = thing.make({ scratch: { "name": "David" } })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise = scratch_1.update({
                    "name": "David",
                });
                // assert.ok(!update_promise);
                assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
            });
            it("optional don't update timestamp", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise = scratch_1.update({
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

                const update_promise = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
                // assert.ok(update_promise);
            });
            it("use @timestamp ... with option to ignore it!", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: false,
                });
                assert.strictEqual(scratch_1.timestamp(), _.timestamp.epoch());
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());
                // assert.ok(update_promise);
            });
            it("use @timestamp ( old, new ) - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                // assert.ok(update_promise_1);
                // assert.ok(update_promise_2);
                assert.strictEqual(scratch_1.timestamp(), TS_NEW);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( old, old ) - expect update", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                // assert.ok(update_promise_1);
                // assert.ok(!update_promise_2);
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "David" }, scratch_1.state());

                update_promise_2
                    .then(() => done())
                    .catch((error) => {
                        done(error);
                    });
            });
            it("use @timestamp ( new, old ) - expect NO update", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                // assert.ok(update_promise_1);
                // assert.ok(!update_promise_2);
                assert.strictEqual(scratch_1.timestamp(), TS_NEW);
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());

                update_promise_2
                    .catch((error) => {
                        assert.ok(error instanceof errors.Timestamp);
                        done();
                    });
            });
            it("use @timestamp ( new, null ) - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                // assert.ok(update_promise_1);
                // assert.ok(update_promise_2);
                assert.ok(scratch_1.timestamp() >= now, "timestamp did not advance");
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( null, new ) - expect NO update", function(done) {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "David",
                }, {
                    add_timestamp: true,
                });
                // assert.ok(update_promise_1);
                // assert.ok(!update_promise_2);
                assert.ok(scratch_1.timestamp() >= now, "timestamp did not advance");
                assert.deepEqual({ "name": "Joanne" }, scratch_1.state());

                update_promise_2
                    .catch((error) => {
                        assert.ok(error instanceof errors.Timestamp);
                        done();
                    });
            });
            it("use @timestamp ( old, old ) with NO CHECK - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                    check_timestamp: false,
                });
                // assert.ok(update_promise_1);
                // assert.ok(update_promise_2);
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( new, old ) with NO CHECK - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "@timestamp": TS_OLD,
                    "name": "David",
                }, {
                    add_timestamp: true,
                    check_timestamp: false,
                });
                // assert.ok(update_promise_1);
                // assert.ok(update_promise_2);
                assert.strictEqual(scratch_1.timestamp(), TS_OLD);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
            it("use @timestamp ( null, new ) with NO CHECK - expect update", function() {
                const thing_1 = thing.make({ scratch: {} })
                const scratch_1 = thing_1.band("scratch");
                const now = _.timestamp.make();

                const update_promise_1 = scratch_1.update({
                    "name": "Joanne",
                }, {
                    add_timestamp: true,
                });
                const update_promise_2 = scratch_1.update({
                    "@timestamp": TS_NEW,
                    "name": "David",
                }, {
                    add_timestamp: true,
                    check_timestamp: false,
                });
                // assert.ok(update_promise_1);
                // assert.ok(update_promise_2);
                assert.strictEqual(scratch_1.timestamp(), TS_NEW);
                assert.deepEqual({ "name": "David" }, scratch_1.state());
            });
        });
    });
});
