/*
 *  ostate_set_null.js
 *
 *  David Janes
 *  IOTDB
 *  2016-08-22
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

const model_document = {
    "iot:model-id": "lighting",
    "iot:attribute": [
        {
            "@id": "#on",
            "iot:purpose": "iot-purpose:on.true",
            "iot:type": "iot:type.null",
            "iot:read": true,
            "iot:write": true,
            "iot:sensor": true,
            "iot:actuator": true
        },
    ]
}
const istate_document = { };

describe("ostate", function() {
    describe("set", function() {
        describe("semantic", function() {
            it("set with a null", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set(":on.true", null);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("set with a 1", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set(":on.true", 1);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("set with nothing", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set(":on.true");
                promise
                    .then((ud) => {
                        done(new Error("setting with no argument is not defined"));
                    })
                    .catch((error) => {
                        done();
                    });
            });
            it("set twice", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set(":on.true", 1);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        const promise_2 = istate_1.set(":on.true", 1);
                        promise_2
                            .then((ud) => {
                                assert.deepEqual(ud, { "on": null });
                                done();
                            });
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("set with a cast", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set(":on.true", null);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
        });
        describe("non-semantic", function() {
            it("set with a null", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set("on", null);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("set with a 1", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set("on", 1);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("set with nothing", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set("on");
                promise
                    .then((ud) => {
                        done(new Error("setting with no argument is not defined"));
                    })
                    .catch((error) => {
                        done();
                    });
            });
            it("set twice", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set("on", 1);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        const promise_2 = istate_1.set("on", 1);
                        promise_2
                            .then((ud) => {
                                assert.deepEqual(ud, { "on": null });
                                done();
                            });
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("set with a cast", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set("on", null);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "on": null });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
        });
    });
});
