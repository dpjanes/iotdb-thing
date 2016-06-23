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

const model_file = path.join(__dirname, './things/thing-basement-heater/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

const istate_file = path.join(__dirname, './things/thing-basement-heater/istate');
const istate_document = JSON.parse(fs.readFileSync(istate_file, 'utf-8'));

const istated = {
    "temperature": 20,
    "set-point": 21
};

describe("istate", function() {
    describe("get", function() {
        describe("non-semantic", function() {
            it("temperature", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature");
                const expect = 20;

                assert.strictEqual(got, expect);
            });
            it("first(temperature)", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.first("temperature");
                const expect = 20;

                assert.strictEqual(got, expect);
            });
            it("list(temperature)", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.list("temperature");
                const expect = [ 20 ];

                assert.deepEqual(got, expect);
            });
            it("/temperature", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("/temperature");
                const expect = 20;

                assert.strictEqual(got, expect);
            });
            it("set-point", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("set-point");
                const expect = 21;

                assert.strictEqual(got, expect);
            });
            it("/set-point", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("/set-point");
                const expect = 21;

                assert.strictEqual(got, expect);
            });
            it("bad", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("bad");
                const expect = undefined;

                assert.strictEqual(got, expect);
            });
            it("first(bad)", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.first("bad");
                const expect = undefined;

                assert.strictEqual(got, expect);
            });
            it("list(bad)", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.list("bad");
                const expect = [];

                assert.deepEqual(got, expect);
            });
            it("/bad", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: istate_document,
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("/bad");
                const expect = undefined;

                assert.strictEqual(got, expect);
            });
        });
        describe("missing istate date - expect null, not undefined", function() {
            it("get", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: {},
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature");
                const expect = null;

                assert.strictEqual(got, expect);
            });
            /*
            it("get with otherwise", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: {},
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.get("temperature", null, "otherwise");
                const expect = "otherwise";

                assert.strictEqual(got, expect);
            });
            */
            it("first", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: {},
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.first("temperature");
                const expect = null;

                assert.strictEqual(got, expect);
            });
            /*
            it("first with otherwise", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: {},
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.first("temperature", null, "otherwise");
                const expect = "otherwise";

                assert.strictEqual(got, expect);
            });
            */
            it("list", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: {},
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.list("temperature");
                const expect = [];

                assert.deepEqual(got, expect);
            });
            /*
            it("list with otherwise", function() {
                const thing_1 = thing.make({
                    model: model_document,
                    istate: {},
                });
                const istate_1 = thing_1.band("istate");

                const got = istate_1.list("temperature", null, "otherwise");
                const expect = "otherwise";

                assert.strictEqual(got, expect);
            });
            */
        });
        describe("semantic", function() {
            describe("leading colon", function() {
                it("temperature", function() {
                    const thing_1 = thing.make({
                        model: model_document,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    const got = istate_1.get(":temperature");
                    const expect = 20;

                    assert.strictEqual(got, expect);
                });
                it("broken attribute", function() {
                    const d = _.d.clone.deep(model_document);
                    delete d["iot:attribute"][0]["@id"];
                    delete d["iot:attribute"][1]["@id"];

                    const thing_1 = thing.make({
                        model: d,
                        istate: istate_document,
                    });
                    const istate_1 = thing_1.band("istate");

                    const got = istate_1.get(":temperature");
                    const expect = undefined;

                    assert.strictEqual(got, expect);
                });
            });
            describe("simple", function() {
            });
            describe("complex", function() {
            });
        });
    });
});
