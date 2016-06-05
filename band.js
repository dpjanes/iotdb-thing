/*
 *  band.js
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

const events = require('events');
const util = require('util');

const iotdb = require("iotdb");
const errors = require("iotdb-errors");
const _ = iotdb._;

const make = (_thing, _d, _band_name) => {
    const self = Object.assign({}, events.EventEmitter.prototype);

    let _timestamp = _.timestamp.epoch();
    let _last_now = null;

    self.set = function(key, value) {
        var ud = {};
        ud[key] = value;

        return self.update(ud, {
            add_timestamp: true,
        });
    };

    self.thing = function() {
        return _thing;
    };

    self.band_name = function() {
        return _band_name;
    };

    self.get = function(key, otherwise) {
        return _.d.get(_d, key, otherwise);
    };

    self.first = function(key, otherwise) {
        return _.d.first(_d, key, otherwise);
    };

    self.list = function(key, otherwise) {
        return _.d.list(_d, key, otherwise);
    };

    self.update = function(updated, paramd) {
        return new Promise(( resolve, reject ) => {
            paramd = _.d.compose.shallow(paramd, {
                add_timestamp: true,
                check_timestamp: true,
                notify: true,
            });

            var utimestamp = updated["@timestamp"];
            if (!utimestamp) {
                // this allows multiple user actions in the same millisecond … very tricky
                utimestamp =  _.timestamp.make();
                if (_last_now === utimestamp) {
                    utimestamp = _.timestamp.advance(utimestamp);
                }

                _last_now = utimestamp;
            }

            if (paramd.check_timestamp && !_.timestamp.check.values(_timestamp, utimestamp)) {
                return reject(new errors.Timestamp());
            }

            updated = _.d.transform(updated, {
                key: function(key) {
                    if (key.match(/^@/)) {
                        return;
                    }

                    return key;
                },
            });

            const changed = {};

            _.mapObject(updated, (uvalue, ukey) => {
                var uvalue = updated[ukey];
                var ovalue = _d[ukey];

                if (_.is.Equal(uvalue, ovalue)) {
                    return;
                }

                _d[ukey] = uvalue;
                _.d.set(changed, ukey, uvalue);

                if (paramd.notify) {
                    process.nextTick(function() {
                        self.emit(ukey, _thing, self, uvalue);
                    });
                }
            });

            if (_.is.Empty(changed)) {
                return resolve(changed);
            }
            
            if (paramd.notify) {
                process.nextTick(function() {
                    _thing.emit(_band_name, _thing, self, changed);
                });
            }

            if (paramd.add_timestamp) {
                _timestamp = utimestamp;
            }

            return resolve(changed);
        });
    };

    self.timestamp = function() {
        return _timestamp;
    };

    self.state = function() {
        return _.d.clone.deep(_d);
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
