/*
 *  ostate_update_instantaneous.js
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
const ostate_document = { };

const TS_OLD = '2010-03-25T21:28:43.613Z';
const TS_NEW = '2012-03-25T21:28:43.613Z';
const TS_FUTURE = '2299-03-25T21:28:43.613Z';

describe("ostate_update_instantaneous", function() {
    describe("no existing value", function() {
        it("update with a nothing - nothing should happen", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": null,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({}, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, {});
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("update with a null - nothing should happen", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": null,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({ "on": null }, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, {});
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("update with a timestamp - should get it back", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": null,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({ "on": TS_NEW }, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, { "on": TS_NEW });
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });
    describe("existing OLD value", function() {
        it("update with a nothing - nothing should happen", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": TS_OLD,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({}, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, {});
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("update with a null - nothing should happen", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": TS_OLD,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({ "on": null }, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, {});
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("update with NEW timestamp - should get it back", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": TS_OLD,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({ "on": TS_NEW }, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, { "on": TS_NEW });
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });
    describe("existing NEW value", function() {
        it("update with OLD timestamp - should get NOTHING", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": TS_NEW,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({ "on": TS_OLD }, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, {});
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("update with NEW timestamp - should get NOTHING", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": TS_NEW,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({ "on": TS_NEW }, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, {});
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
        it("update with FUTURE timestamp - should get FUTURE", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                ostate: {
                    "on": TS_NEW,
                }
            });
            const ostate_1 = thing_1.band("ostate");

            const promise = ostate_1.update({ "on": TS_FUTURE }, {})
            promise
                .then((ud) => {
                    assert.deepEqual(ud, { "on": TS_FUTURE });
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });
    });
});
