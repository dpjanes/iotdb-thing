/*
 *  istate.js
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

const iotdb = require("iotdb");
const _ = iotdb._;

const band = require("./band");

const make = (_thing, _d, _band) => {
    const self = band.make(_thing, _d, _band);

    self._get = (d, key, otherwise) => {
        if (!key) {
            return undefined;
        }

        return _.d.get(d, key, otherwise || null);
    };
    
    self._first = (d, key, otherwise) => {
        if (!key) {
            return undefined;
        }

        return _.d.first(d, key, otherwise || null);
    };

    self._list = (d, key, otherwise) => {
        if (!key) {
            return undefined;
        }

        return _.d.list(d, key, otherwise || null);
    };

    self._transform_key = (key) => {
        const thing = self.thing();
        const attribute = thing.attribute(key);
        if (!attribute) {
            return null;
        }

        const id = _.ld.first(attribute, "@id");
        if (!id) {
            return null;
        }

        return id.replace(/^.*#/, '');
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
