/*
 *  cast.js
 *
 *  David Janes
 *  IOTDB
 *  2016-06-08
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

"use struct";

const _ = require("iotdb-helpers");

const _coerce_value = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    self.value = _.coerce.coerce(self.value, _.coerce.list(self.to["iot:type"]))
};

const _convert_unit = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    const unit_of_from = _.d.first(self.from, "iot:unit");
    if (!unit_of_from) {
        return;
    }

    const unit_of_to = _.d.first(self.to, "iot:unit");
    if (!unit_of_to) {
        return;
    }

    self.value = _.convert.convert({
        from: unit_of_from,
        to: unit_of_to,
        value: self.value,
    });
};

const _bound_minumum = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    const bound = _.coerce.coerce(self.to["iot:minimum"], _.coerce.classify(self.value));
    if (_.is.Undefined(bound)) {
        return;
    }

    if (self.value < bound) {
        self.value = bound;
    }
};

const _bound_maximum = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    const bound = _.coerce.coerce(self.to["iot:maximum"], _.coerce.classify(self.value));
    if (_.is.Undefined(bound)) {
        return;
    }

    if (self.value > bound) {
        self.value = bound;
    }
};

const _format_value = (self) => {
    if (_.is.Undefined(self.value)) {
        return;
    }

    const to_format = _.d.first(self.to, "iot:format");
    if (!to_format) {
        return;
    }

    switch (to_format) {
    case "iot:format.color":
        return _format_color(self);
    case "iot:format.date":
        return _format_date(self);
    case "iot:format.datetime":
        return _format_datetime(self);
    case "iot:format.iri":
        return _format_iri(self);
    case "iot:format.time":
        return _format_time(self);
    case "iot:format.timedelta":
        return _format_timedelta(self);
    default:
        return null;
    }
};

const cast = (value, from, to) => {
    if (!to) {
        return value;
    }

    const self = {
        value: value,
        from: from,
        to: to,
    };

    _coerce_value(self);
    _convert_unit(self);
    _bound_minumum(self);
    _bound_maximum(self);
    _format_value(self);

    return self.value;
};

const _format_color = self => {
    if (!_.is.String(self.value)) {
        self.value = undefined;
        return;
    }

    self.value = self.value.toUpperCase();
    if (self.value.match(/^#[0-9A-F]{6}$/)) {
        return;
    }

    self.value = _.color.color_to_hex(self.value, undefined);
};

const _make_date = (value) => {
    let dt = null;
    if (_.is.Number(value)) {
        dt = new Date(value * 1000);
    } else if (_.is.String(value)) {
        dt = new Date(value);
    } else {
        return;
    }

    if (_.is.NaN(dt.getFullYear())) {
        return;
    }

    return dt;
}

const _format_date = self => {
    const dt = _make_date(self.value);
    if (!dt) {
        self.value = undefined;
        return;
    }

    self.value = dt.toISOString().replace(/T.*$/, '');
};

const _format_datetime = self => {
    const dt = _make_date(self.value);
    if (!dt) {
        self.value = undefined;
        return;
    }

    self.value = dt.toISOString();
};

const _format_iri = self => {};

const _format_time = self => {
    if (!_.is.String(value)) {
        self.value = undefined;
        return;
    }

    const dt = _make_date("2000-01-01T" + self.value + "Z");
    if (!dt) {
        self.value = undefined;
        return;
    }

    self.value = dt.toISOString().replace(/^.*T(.*)Z$/, "$1");
};

const _format_timedelta = self => {};

// inbound: iot:UNIVERSAL -> THING-SPECIFIC
// outbound: THING-SPECIFIC -> iot:UNIVERSAL
const enumerate = (value, to, inbound) => {
    if (_.is.Undefined(value)) {
        return value;
    }

    let enumeration = to["iot:enumeration"]
    if (!enumeration) {
        return value;
    }

    if (_.is.Array(enumeration)) {
        enumeration = _.object(enumeration, enumeration);
    } else if (inbound) {
        enumeration = _.invert(enumeration);
    }

    return enumeration[value];
};

/**
 *  API
 */
exports.cast = cast;
exports.enumerate = enumerate;
