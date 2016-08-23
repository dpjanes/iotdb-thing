/*
 *  band_state.js
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

const helpers = require("./helpers");

const _ = require("iotdb-helpers");

const band = require("./band");
const cast = require("./cast");

const _state_lookup_key = (key, thing) => {
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

const make = (_thing, _d, _band) => {
    const self = band.make(_thing, _d, _band);

    const _retrieve = (d, key, otherwise, how) => {
        if (!key) {
            return;
        }

        return _.d[how](d, key, otherwise || null);
    }

    self._get = (d, key, otherwise) => _retrieve(d, key, otherwise, "get");
    self._first = (d, key, otherwise) => _retrieve(d, key, otherwise, "first");
    self._list = (d, key, otherwise) => _retrieve(d, key, otherwise, "list");

    self._transform_key = (key) => _state_lookup_key(key, self.thing());
    self._cast = (key, as_type, value) => {
        const attribute = self.thing().attribute(key);
        if (!attribute) {
            return;
        }

        value = cast.cast(value, attribute, as_type);
        if (_.is.Null(value)) {
            return value;
        } else {
            return cast.enumerate(value, attribute, true);
        }
    };

    self._prepare_update = (ud) => {
        const rds = [];
        const thing = self.thing();

        _.mapObject(ud, ( uvalue, ukey ) => {
            const key = _state_lookup_key(ukey, thing);
            if (ukey.match(/^@/)) {
            } else if (!key) {
                rds.push({
                    key: ukey,
                    value: uvalue,
                    is_validated: false,
                });
            } else {
                const attribute = thing.attribute(ukey);
                const value = cast.cast(uvalue, null, attribute);
                const enum_value = cast.enumerate(value, attribute, true);
                if (_.is.Undefined(enum_value)) {
                    rds.push({
                        key: key,
                        value: uvalue,
                        is_validated: false,
                    });
                } else {
                    rds.push({
                        key: key,
                        value: value,  
                    });
                }
            }
        });

        return rds;
    };

    self._prepare_set = ( ukey, uvalue, as_type ) => {
        const rds = [];
        const thing = self.thing();

        const key = _state_lookup_key(ukey, thing);
        if (!key) {
            rds.push({
                key: ukey,
                value: uvalue,
                is_validated: false,
            });
        } else {
            const attribute = thing.attribute(ukey);
            const value = cast.enumerate(cast.cast(uvalue, as_type, attribute), attribute);
            if (_.is.Undefined(value)) {
                rds.push({
                    key: key,
                    value: uvalue,
                    is_validated: false,
                });
            } else {
                let is_null_type = false;
                if ((value === null) && (_.d.list(attribute, "iot:type", []).indexOf("iot:type.null") > -1)) {
                    is_null_type = true;
                }

                rds.push({
                    key: key,
                    value: value,
                    is_null_type: is_null_type,
                });
            }
        }

        return rds;
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
