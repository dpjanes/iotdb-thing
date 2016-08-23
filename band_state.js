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


const _key = attribute => {
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

    self._transform_key = key => _key(self.thing().attribute(key));
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
            const attribute = thing.attribute(ukey);
            if (ukey.match(/^@/)) {
            } else if (!attribute) {
                rds.push({
                    key: ukey,
                    value: uvalue,
                    is_validated: false,
                });
            } else {
                const key = _key(attribute);
                if (_.d.first(attribute, "iot:instantaneous")) {
                    rds.push({
                        key: key,
                        value: uvalue,  
                        is_instantaneous: true,
                    });
                } else {
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
            }
        });

        return rds;
    };

    const _alternate = ( ukey, uvalue ) => {
        if (!_.is.String(ukey)) {
            return;
        } else if (ukey.indexOf(':') === -1) {
            return;
        }

        const thing = self.thing();

        const bvalue = _.coerce.coerce(uvalue, [ "iot:type.boolean" ])
        if (bvalue) {
            const nkey = ukey + ".true";
            const attribute = thing.attribute(nkey)
            if (attribute) {
                return attribute
            }
        } else {
            const nkey = ukey + ".false";
            const attribute = thing.attribute(nkey)
            if (attribute) {
                return attribute
            }
        }
    }

    self._prepare_set = ( ukey, uvalue, as_type ) => {
        const rds = [];
        const thing = self.thing();

        let attribute = thing.attribute(ukey);
        if (!attribute) {
            attribute = _alternate(ukey, uvalue);
        }

        if (!attribute) {
            rds.push({
                key: ukey,
                value: uvalue,
                is_validated: false,
            });
        } else {
            const key = _key(attribute);
            if (_.d.first(attribute, "iot:instantaneous")) {
                rds.push({
                    key: key,
                    value: _.timestamp.make(),
                    is_instantaneous: true,
                });
            } else {
                const value = cast.enumerate(cast.cast(uvalue, as_type, attribute), attribute);
                if (_.is.Undefined(value)) {
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
        }

        return rds;
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
