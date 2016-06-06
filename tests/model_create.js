/*
 *  model_create.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-06
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

describe("model", function() {
    describe("create", function() {
        it("default", function() {
            const thing_1 = thing.make();
            const model_1 = thing_1.band("model");

            assert.ok(model_1);
            assert.strictEqual(model_1.band_name(), "model");
            assert.strictEqual(model_1.thing(), thing_1);
        });
        it("initialized", function() {
            const model_file = path.join(__dirname, './things/thing-basement-heater/model');
            const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));
            const thing_1 = thing.make({
                model: model_document,
            });
            const model_1 = thing_1.band("model");

            assert.ok(model_1);
            assert.strictEqual(model_1.band_name(), "model");
            assert.strictEqual(model_1.thing(), thing_1);

            // console.log(model_1.state());
        });
    });
    describe("update", function() {
        it("load from file", function() {
            const thing_1 = thing.make();
            const model_1 = thing_1.band("model");

            const model_file = path.join(__dirname, './things/thing-basement-heater/model');
            const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));
            model_1.update(model_document);

            assert.ok(model_1);
            assert.strictEqual(model_1.band_name(), "model");
            assert.strictEqual(model_1.thing(), thing_1);

            // console.log(model_1.state());
        });
        it("load from file (expanded)", function() {
            const thing_1 = thing.make();
            const model_1 = thing_1.band("model");

            const model_file = path.join(__dirname, './things/thing-basement-heater/model');
            const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));
            model_1.update(_.ld.expand(model_document));

            assert.ok(model_1);
            assert.strictEqual(model_1.band_name(), "model");
            assert.strictEqual(model_1.thing(), thing_1);

            // console.log(model_1.state());
        });
    });
});
