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

const _ = require("iotdb-helpers");

const errors = require("iotdb-errors");
const helpers = require("./helpers");
const cast = require("./cast");

const make = (_thing, d, _band_name) => {
    const self = Object.assign({});

    let _d = _.d.clone.deep(d);
    let _timestamp = _.timestamp.epoch();
    let _pending = {};
    let _emitter = new events.EventEmitter();

    const _update = (uds, paramd) => {
        return new Promise((resolve, reject) => {
            paramd = _.d.compose.shallow(paramd, {
                add_timestamp: true,
                check_timestamp: true,
                notify: true,
                validate: true,
                replace: false,
            });

            let utimestamp = paramd.timestamp || _.timestamp.advance(_timestamp);

            if (paramd.check_timestamp && !_.timestamp.check.values(_timestamp, utimestamp)) {
                return reject(new errors.Timestamp());
            }

            if (paramd.validate) {
                const invalids = _.map(_.filter(uds, (ud) => ud.is_validated === false), (ud) => ud.key);
                if (invalids.length) {
                    return reject(new errors.Invalid("invalid updates: " + invalids.join(",")));
                }
            }

            uds = uds
                .filter(ud => !ud.key.match(/^@/))
                .filter(ud => ud.is_validated !== false);

            const changed = {};

            if (paramd.replace) {
                const updating = uds.map(ud => ud.key);

                _.pairs(_d)
                    .filter(kv => kv[1] !== null)
                    .map(kv => kv[0])
                    .filter(key => !key.match(/^@/))
                    .filter(key => updating.indexOf(key) === -1)
                    .forEach(key => {
                        uds.push({
                            key: key,
                            value: null,
                        });
                    });
            }

            uds.forEach(ud => {
                ud.old = _.d.get(_d, ud.key);
            });

            uds
                .filter(ud => !_.is.Equal(ud.value, ud.old))
                .filter(ud => !ud.is_instantaneous || !ud.old || (ud.value >= ud.old))
                .map(ud => {
                    if (ud.value === null) {
                        delete _d[ud.key];
                    } else {
                        self._put(_d, ud.key, ud.value);
                    }
                    self._put(changed, ud.key, ud.value);

                    if (paramd.notify) {
                        process.nextTick(() => {
                            _emitter.emit(ud.key, _thing, self, ud.value);
                        });
                    }
                });

            if (_.is.Empty(changed)) {
                return resolve(changed);
            }

            if (paramd.notify) {
                // thing-level notifications are batched on ticks
                _pending = _.d.compose.shallow(changed, _pending);

                process.nextTick(() => {
                    if (_.is.Empty(_pending)) {
                        return;
                    }

                    const p = _pending;
                    _pending = {};

                    _thing.emit(_band_name, _thing, self, p);
                });
            }

            if (paramd.add_timestamp) {
                _timestamp = utimestamp;
            }

            return resolve(changed);
        });
    };

    self.thing = () => _thing;
    self.band_name = () => _band_name;
    self.timestamp = () => _timestamp;

    self.set = (key, value, as_type) => _update(self._prepare_set(key, value, as_type));
    self.update = (updated, paramd) => _update(
        self._prepare_update(updated),
        _.d.compose.shallow({
            timestamp: updated["@timestamp"]
        }, paramd)
    );

    self.state = () => _.d.clone.deep(_d);
    self.get = (key, as_type) => self._cast(key, as_type, self._get(_d, self._transform_key(key)));
    self.list = (key, as_type) => (self._list(_d, self._transform_key(key)) || [])
        .map(item => self._cast(key, as_type, item))
        .filter(item => (item !== undefined));
    self.first = (key, as_type) => self._cast(key, as_type, self._first(_d, self._transform_key(key)));

    // emitter section
    self.emitter = () => _emitter;
    self.on = (key, listener) => _emitter.on(self._transform_key(key), listener);

    // dictionary manipulation - only for internal and descendents
    self._cast = (key, as_type, value) => cast.cast(value, {}, as_type);
    self._get = (d, key) => _.d.get(d, key);
    self._first = (d, key) => _.d.first(d, key);
    self._list = (d, key) => _.d.list(d, key);
    self._put = (d, key, value) => _.d.set(d, key, value);
    self._transform_key = (key) => key;
    self._prepare_update = helpers.unroll_deep;
    self._prepare_set = (key, value, as_type) => {
        const updated = {};
        updated[key] = value;

        return helpers.unroll_deep(updated);
    };

    return self;
};

/**
 *  API
 */
exports.make = make;
