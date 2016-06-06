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
const unroll_deep = (d) => {
    const rds = [];

    const _unroller = (o, path) => {
        if (_.is.Array(o) || !_.is.Object(o)) {
            rds.push({
                key: path.join("/"),
                value: o,
            })
            return;
        }

        _.mapObject(o, ( _value, _key ) => {
            const npath = path.slice(0);
            npath.push(_key);

            _unroller(_value, npath);
        });
    };

    _unroller(d, []);

    return rds;
};

const unroll_shallow = (d) => {
    const rds = [];

    _.mapObject(d, ( _value, _key ) => {
        rds.push({
            key: _key,
            value: _value,
        })
    });

    return rds;
};

const flat_get = function(d, key, otherwise) {
    const value = d[key];
    if (value === undefined) {
        return otherwise;
    } else {
        return value;
    }
};

const flat_first = function(d, key, otherwise) {
    const value = d[key];
    if (value === undefined) {
        return otherwise;
    } else if (!_.is.Array(value)) {
        return value;
    } else if (value.length) {
        return value[0];
    } else {
        return otherwise;
    }
};

const flat_list = function(d, key, otherwise) {
    const value = d[key];
    if (value === undefined) {
        return otherwise;
    } else if (_.is.Array(value)) {
        return value;
    } else {
        return [ value ];
    }
};

const flat_put = function(d, key, value) {
    d[key] = value;
};

/**
 *  API
 */
exports.unroll_deep = unroll_deep;
exports.unroll_shallow = unroll_shallow;

exports.flat_get = flat_get;
exports.flat_first = flat_first;
exports.flat_list = flat_list;
exports.flat_put = flat_put;
