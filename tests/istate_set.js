/*
 *  istate_set.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-07
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

const model_file = path.join(__dirname, './things/thing-basement-heater/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

const istate_file = path.join(__dirname, './things/thing-basement-heater/istate');
const istate_document = JSON.parse(fs.readFileSync(istate_file, 'utf-8'));

const istated = {
    "temperature": 20,
    "set-point": 21
};

describe("istate", function() {
/*
                it("iot-purpose:temperature/sensor", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

            const got = thing_1.attribute({
                "iot:purpose": "iot-purpose:temperature",
                "iot:sensor": true,
            });
            console.log("GOT", got);
                    istate_1.set({
                        "iot:purpose": "iot-purpose:temperature", 
                        "iot:sensor": true,
                    }, 10);

                    assert.deepEqual(istate_1.state(), {
                        "temperature": 10,
                        "set-point": 21,
                    });
                });
                */
    describe("set", function() {
        describe("general function", function() {
            it("promise success", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set("temperature", 0);
                promise
                    .then((ud) => {
                        assert.deepEqual(ud, { "temperature": 0 });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("promise fail", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const promise = istate_1.set("bad", 0);
                promise
                    .then((ud) => {
                        assert(false, "shouldn't reach here");
                    })
                    .catch((error) => {
                        if (error instanceof errors.Invalid) {
                            return done();
                        }

                        done(error);
                    });
            });
            it("on (non-semantic)", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");
                istate_1.on("temperature", (_thing, _band, _value) => {
                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, istate_1);
                    assert.strictEqual(_value, 0);

                    done();
                });
                istate_1.set("temperature", 0);
            });
            it("on (semantic)", function(done) {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");
                istate_1.on(":temperature", (_thing, _band, _value) => {
                    assert.strictEqual(_thing, thing_1);
                    assert.strictEqual(_band, istate_1);
                    assert.strictEqual(_value, 0);

                    done();
                });
                istate_1.set("temperature", 0);
            });
            it("value change", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                assert.deepEqual(istate_1.state(), istated);
                istate_1.set("temperature", 0);
                assert.deepEqual(istate_1.state(), {
                    "temperature": 0,
                    "set-point": 21
                });
            });
        });
        describe("non-semantic", function() {
            describe("unrooted", function() {
                it("temperature", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set("temperature", 0);
                    assert.deepEqual(istate_1.state(), {
                        "temperature": 0,
                        "set-point": 21,
                    });
                });
                it("set-point", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set("set-point", 18);
                    assert.deepEqual(istate_1.state(), {
                        "temperature": 20,
                        "set-point": 18,
                    });
                });
            });
            describe("rooted", function() {
                it("/temperature", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set("/temperature", 0);
                    assert.deepEqual(istate_1.state(), {
                        "temperature": 0,
                        "set-point": 21,
                    });
                });
                it("/set-point", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set("/set-point", 18);
                    assert.deepEqual(istate_1.state(), {
                        "temperature": 20,
                        "set-point": 18,
                    });
                });
            });
            describe("bad", function() {
                it("does not exist", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set("/bad", 0);
                    assert.deepEqual(istate_1.state(), istated);
                });
                it("weird argument", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set(0, 0);
                    assert.deepEqual(istate_1.state(), istated);
                });
            });
        });
        describe("semantic", function() {
            describe("simple", function() {
                it(":temperature", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set(":temperature", 5);
                    assert.deepEqual(istate_1.state(), {
                        "temperature": 5,
                        "set-point": 21,
                    });
                });
            });
            describe("full", function() {
                it("iot-purpose:temperature", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set("iot-purpose:temperature", 8);
                    assert.deepEqual(istate_1.state(), {
                        "temperature": 8,
                        "set-point": 21,
                    });
                });
            });
            describe("complex", function() {
                it("iot-purpose:temperature/sensor", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set({
                        "iot:purpose": "iot-purpose:temperature", 
                        "iot:sensor": true,
                    }, 10);

                    assert.deepEqual(istate_1.state(), {
                        "temperature": 10,
                        "set-point": 21,
                    });
                });
                it("iot-purpose:temperature/actuator", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    istate_1.set({
                        "iot:purpose": "iot-purpose:temperature", 
                        "iot:actuator": true,
                    }, 12);

                    assert.deepEqual(istate_1.state(), {
                        "temperature": 20,
                        "set-point": 12,
                    });
                });
            });
        });
    });
});
