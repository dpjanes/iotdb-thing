/*
 *  meta_create.js
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

const assert = require("assert");
const thing = require("../thing");

describe("meta", function() {
    describe("create", function() {
        it("default", function() {
            const thing_1 = thing.make();
            const meta_1 = thing_1.band("meta");

            assert.ok(meta_1);
            assert.strictEqual(meta_1.band_name(), "meta");
            assert.strictEqual(meta_1.thing(), thing_1);
        });
    });
    describe("set", function() {
        /*
        it("schema:name", function(done) {
            const thing_1 = thing.make();
            const meta_1 = thing_1.band("meta");

            const promise_1 = meta_1.set("schema:name", "David");

            promise_1.then((ud) => {
                assert.deepEqual(ud, { "schema:name": "David" });
                done();
            });
        });
        */
        it("expanded(schema:name)", function(done) {
            const thing_1 = thing.make();
            const meta_1 = thing_1.band("meta");

            const promise_1 = meta_1.set(_.ld.expand("schema:name"), "David");

            promise_1.then((ud) => {
                console.log("HERE:RESULT", ud);
                assert.deepEqual(ud, { "schema:name": "David" });
                done();
            }).catch((error) =>{
                done(error);
            });
        });

    });
});
