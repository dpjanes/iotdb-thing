/*
 *  istate_get.js
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

const assert = require("assert");
const thing = require("../thing");
const as = require("../as");

const model_file = path.join(__dirname, './things/thing-basement-heater/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

const istate_file = path.join(__dirname, './things/thing-basement-heater/istate');
const istate_document = JSON.parse(fs.readFileSync(istate_file, 'utf-8'));

describe("istate", function() {
    describe("get", function() {
        describe("unit", function() {
            it("temperature (celsius)", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", as.celsius());
                const expect = 20;

                assert.strictEqual(got, expect);
            });
            it("temperature (fahrenheit)", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", as.fahrenheit());
                const expect = 68;

                assert.strictEqual(got, expect);
            });
            it("temperature (kelvin)", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", as.kelvin());
                const expect = 293.15;

                assert.strictEqual(got, expect);
            });
        });
        describe("min/max", function() {
            it("min", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", {
                    "iot:minimum": 50,
                });
                const expect = 50;

                assert.strictEqual(got, expect);
            });
            it("max", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", {
                    "iot:maximum": -50,
                });
                const expect = -50;

                assert.strictEqual(got, expect);
            });
        });
        describe("type coercd", function() {
            it("null", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", as.null());
                const expect = null;

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", as.boolean());
                const expect = true;

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                istate_1.set("temperature", 23.345);
                const got = istate_1.get("temperature", as.integer());
                const expect = 23;

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                istate_1.set("temperature", 23.345);
                const got = istate_1.get("temperature", as.number());
                const expect = 23.345;

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", as.string());
                const expect = "20";

                assert.strictEqual(got, expect);
            });
        });
    });
});
