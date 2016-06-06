/*
 *  helpers.js
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

/**
 *  Convert a dictionary into a "unrolled" dictionary,
 *  where the keys are paths into the original dictionary
 */
const unroll = (d) => {
    const rd = {};

    const _unroller = (o, path) => {
        if (_.is.Array(o) || !_.is.Object(o)) {
            rd[path.join("/")] = o;
            return;
        }

        _.mapObject(o, ( _value, _key ) => {
            const npath = path.slice(0);
            npath.push(_key);

            _unroller(_value, npath);
        });
    };

    _unroller(d, []);

    return rd;
};

/**
 *  API
 */
exports.unroll = unroll;