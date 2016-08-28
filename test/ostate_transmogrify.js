/*
 *  ostate_transmogrify.js
 *
 *  David Janes
 *  IOTDB
 *  2016-08-23
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

describe("ostate_transmogrify", function() {
    describe("on -> on.true", function() {
        const model_document = {
            "iot:model-id": "lighting",
            "iot:attribute": [
                {
                    "@id": "#on",
                    "iot:purpose": "iot-purpose:on.true",
                    "iot:type": "iot:type.string",
                    "iot:instantaneous": true,
                    "iot:read": true,
                    "iot:write": true,
                    "iot:sensor": true,
                    "iot:actuator": true
                },
            ]
        }
        it("success", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {},
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.set(":on", true);
            promise
                .then((ud) => {
                    assert.ok(ud["on"]);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("fail", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {},
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.set(":on", false);
            promise
                .then((ud) => {
                    done(new Error("didn't expected this to succeed"));
                })
                .catch((error) => {
                    done();
                });
        });
    });
    describe("on -> on.false", function() {
        const model_document = {
            "iot:model-id": "lighting",
            "iot:attribute": [
                {
                    "@id": "#off",
                    "iot:purpose": "iot-purpose:on.false",
                    "iot:type": "iot:type.string",
                    "iot:instantaneous": true,
                    "iot:read": true,
                    "iot:write": true,
                    "iot:sensor": true,
                    "iot:actuator": true
                },
            ]
        }
        it("success", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {},
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.set(":on", false);
            promise
                .then((ud) => {
                    assert.ok(ud["off"]);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("fail", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {},
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.set(":on", true);
            promise
                .then((ud) => {
                    done(new Error("didn't expected this to succeed"));
                })
                .catch((error) => {
                    done();
                });
        });
    });
    describe("on.true/on.false -> on", function() {
        const model_document = {
            "iot:model-id": "lighting",
            "iot:attribute": [
                {
                    "@id": "#on",
                    "iot:purpose": "iot-purpose:on",
                    "iot:type": "iot:type.boolean",
                    "iot:read": true,
                    "iot:write": true,
                    "iot:sensor": true,
                    "iot:actuator": true
                },
            ]
        }
        it("on.true", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {},
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.set(":on.true");
            promise
                .then((ud) => {
                    assert.ok(ud["on"] === true);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("on.false", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {},
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.set(":on.false");
            promise
                .then((ud) => {
                    assert.ok(ud["on"] === false);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });
});
