/*
 *  ostate_enumeration.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-20
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

const model_file = path.join(__dirname, './things/thing-master-tv-on/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

describe("ostate_enumeration", function() {
    describe("enumeration", function() {
        describe("set", function() {
            it("success", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const promise = ostate_1.set("band", "iot-purpose:band.aux");
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "band": "AUX" });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("bad value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const promise = ostate_1.set("band", "iot-purpose:band.unknown");
                promise
                    .then((ud) => {
                        done(new Error("this should not work"));
                    })
                    .catch((error) => {
                        done();
                    });
            });
        });
        describe("update", function() {
            it("success", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const promise = ostate_1.update({
                    "band": "AUX",
                });
                promise
                    .then((ud) => {
                        // assert.deepEqual(ud, { "band": "iot-purpose:band.aux" });
                        assert.deepEqual(ud, { "band": "AUX" });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("bad value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const promise = ostate_1.update({
                    "band": "NOT-KNOWN",
                });
                promise
                    .then((ud) => {
                        done(new Error("this should not work"));
                    })
                    .catch((error) => {
                        done();
                    });
            });
        });
        describe("get (non-semantic)", function() {
            it("success - no value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.get("band");
                assert.deepEqual(value, null);
                done();
            });
            it("success - with value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {
                        "band": "AUX",
                    },
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.get("band");
                assert.deepEqual(value, "iot-purpose:band.aux");
                done();
            });
        });
        describe("get (semantic)", function() {
            it("success - no value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.get("iot-purpose:band");
                assert.deepEqual(value, null);
                done();
            });
            it("success - with value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {
                        "band": "AUX",
                    },
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.get("iot-purpose:band");
                assert.deepEqual(value, "iot-purpose:band.aux");
                done();
            });
        });
        describe("first (non-semantic)", function() {
            it("success - no value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.first("band");
                assert.deepEqual(value, null);
                done();
            });
            it("success - with value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {
                        "band": "AUX",
                    },
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.first("band");
                assert.deepEqual(value, "iot-purpose:band.aux");
                done();
            });
        });
        describe("first (semantic)", function() {
            it("success - no value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.first("iot-purpose:band");
                assert.deepEqual(value, null);
                done();
            });
            it("success - with value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {
                        "band": "AUX",
                    },
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.first("iot-purpose:band");
                assert.deepEqual(value, "iot-purpose:band.aux");
                done();
            });
        });
        describe("list (non-semantic)", function() {
            it("success - no value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.list("band");
                assert.deepEqual(value, []);
                done();
            });
            it("success - with value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {
                        "band": "AUX",
                    },
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.list("band");
                assert.deepEqual(value, [ "iot-purpose:band.aux" ]);
                done();
            });
        });
        describe("list (semantic)", function() {
            it("success - no value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.list("iot-purpose:band");
                assert.deepEqual(value, []);
                done();
            });
            it("success - with value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {
                        "band": "AUX",
                    },
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.list("iot-purpose:band");
                assert.deepEqual(value, [ "iot-purpose:band.aux" ]);
                done();
            });
            it("success - with list value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {
                        "band": [ "AUX" ],
                    },
                });
                const ostate_1 = thing_1.band("ostate");

                const value = ostate_1.list("iot-purpose:band");
                assert.deepEqual(value, [ "iot-purpose:band.aux" ]);
                done();
            });
        });
        describe("set - with enum list rather than dictionary", function() {
            it("success", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const promise = ostate_1.set("color-mode", "SPORTS");
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "color-mode": "SPORTS" });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("bad value", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    ostate: {},
                });
                const ostate_1 = thing_1.band("ostate");

                const promise = ostate_1.set("color-mode", "BAD");
                promise
                    .then((ud) => {
                        done(new Error("this should not work"));
                    })
                    .catch((error) => {
                        done();
                    });
            });
        });
    });
});
