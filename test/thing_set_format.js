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

const model_file = path.join(__dirname, './things/thing-master-lighting/model');
const model_document = JSON.parse(fs.readFileSync(model_file, 'utf-8'));

const istate_file = path.join(__dirname, './things/thing-master-lighting/istate');
const istate_document = JSON.parse(fs.readFileSync(istate_file, 'utf-8'));

const istated = {
    "temperature": 20,
    "set-point": 21
};

describe("istate", function() {
    describe("set", function() {
        it("on (non-semantic)", function(done) {
            const thing_1 = thing.make({
                model: model_document,
                istate: istate_document,
            });
            const istate_1 = thing_1.band("istate");
            const promise_1 = istate_1.set(":color", "red");
            promise_1
                .then(ud => {
                    done();
                });

        });
    });
});
