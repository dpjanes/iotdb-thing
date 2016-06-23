/*
 *  meta_update.js
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

const iotdb = require("iotdb");
const _ = iotdb._;

const assert = require("assert");
const thing = require("../thing");

describe("meta", function() {
    describe("update", function() {
        describe("general", function() {
            it("schema:name", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "schema:name": "David",
                })

                promise_1
                    .then((ud) => {
                        assert.deepEqual(ud, { "schema:name": "David" });
                        done();
                    })
                    .catch((error) => {
                        done(error);
                    });
            });
            it("expanded(schema:name)", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const updated = {};
                updated[_.ld.expand("schema:name")] = "David";

                const promise_1 = meta_1.update(updated);

                promise_1
                    .then((ud) => {
                        assert.deepEqual(ud, { "schema:name": "David" });
                        done();
                    }).catch((error) =>{
                        done(error);
                    });
            });
        });
        describe("safe values", function() {
            it("schema:name", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "schema:name": "http://schema.org/something"
                });

                promise_1.then((ud) => {
                    assert.deepEqual(ud, { "schema:name": "http://schema.org/something" });
                    done();
                }).catch((error) =>{
                    done(error);
                });
            });
            it("schema:description", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "schema:description": "http://schema.org/something"
                });

                promise_1.then((ud) => {
                    assert.deepEqual(ud, { "schema:description": "http://schema.org/something" });
                    done();
                }).catch((error) =>{
                    done(error);
                });
            });
            it("iot:help", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "iot:help": "http://schema.org/something"
                });

                promise_1.then((ud) => {
                    assert.deepEqual(ud, { "iot:help": "http://schema.org/something" });
                    done();
                }).catch((error) =>{
                    done(error);
                });
            });
            it("value number", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "iot:purpose": 12
                });

                promise_1.then((ud) => {
                    assert.deepEqual(ud, { "iot:purpose": 12 });
                    done();
                }).catch((error) =>{
                    done(error);
                });
            });
            it("value boolean", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "iot:purpose": false
                });

                promise_1.then((ud) => {
                    assert.deepEqual(ud, { "iot:purpose": false });
                    done();
                }).catch((error) =>{
                    done(error);
                });
            });
        });
        describe("url values", function() {
            it("iot:purpose", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "iot:purpose": "http://schema.org/something"
                });

                promise_1.then((ud) => {
                    assert.deepEqual(ud, { "iot:purpose": "schema:something" });
                    done();
                }).catch((error) =>{
                    done(error);
                });
            });
        });
        describe("array values", function() {
            it("iot:purpose", function(done) {
                const thing_1 = thing.make();
                const meta_1 = thing_1.band("meta");

                const promise_1 = meta_1.update({
                    "iot:purpose": [ "http://schema.org/something", "schema:something-else", ] 
                });

                promise_1.then((ud) => {
                    assert.deepEqual(ud, { "iot:purpose": [ "schema:something", "schema:something-else" ] });
                    done();
                }).catch((error) =>{
                    done(error);
                });
            });
        });

    });
});
