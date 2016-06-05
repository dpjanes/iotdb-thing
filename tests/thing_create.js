/*
 *  thing_create.js
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

const assert = require("assert");
const thing = require("../thing");

describe("thing", function() {
    describe("create", function() {
        describe("no arguments", function() {
            it("doesn't crash", function() {
                const thing_1 = thing.make()
            });
            it("has meta band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("meta"));
                assert.strictEqual(thing_1.band("meta").band(), "meta");
                assert.strictEqual(thing_1.band("meta").thing(), thing_1);
            });
            it("has model band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("model"));
                assert.strictEqual(thing_1.band("model").band(), "model");
                assert.strictEqual(thing_1.band("model").thing(), thing_1);
            });
            it("has istate band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("istate"));
                assert.strictEqual(thing_1.band("istate").band(), "istate");
                assert.strictEqual(thing_1.band("istate").thing(), thing_1);
            });
            it("has ostate band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("ostate"));
                assert.strictEqual(thing_1.band("ostate").band(), "ostate");
                assert.strictEqual(thing_1.band("ostate").thing(), thing_1);
            });
            it("has connection band", function() {
                const thing_1 = thing.make()

                assert.ok(thing_1.band("connection"));
                assert.strictEqual(thing_1.band("connection").band(), "connection");
                assert.strictEqual(thing_1.band("connection").thing(), thing_1);
            });
        });
    })
});
