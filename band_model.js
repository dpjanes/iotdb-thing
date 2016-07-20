/*
 *  model.js
 *
 *  David Janes
 *  IOTDB
 *  2016-02-13
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

const _ = require("iotdb-helpers");

const assert = require("assert");

const helpers = require("./helpers");
const band = require("./band");

const make = (_thing, _d, _band) => {
    const self = band.make(_thing, _d, _band);

    assert.ok(_.is.Empty(_d) || !_.is.Empty(self.first("iot:model-id")), "iot:model-id is required");

    self._get = helpers.flat_get;
    self._first = helpers.flat_first;
    self._list = helpers.flat_get;
    self._put = helpers.flat_put;
    self._prepare_update = (ud) => helpers.unroll_shallow(_.ld.compact(ud));
    self._prepare_set = (key, value) => {
        const ud = {};
        ud[key] = value;

        return helpers.unroll_shallow(_.ld.compact(ud));
    };

    self._transform_key = (key) => _.ld.compact(key);

    return self;
};

/**
 *  API
 */
exports.make = make;
