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
const cast = require("../cast")

const assert = require("assert");

const to_temperature = {
    "@id": "#temperature",
    "iot:purpose": "iot-purpose:temperature",
    "iot:type": "iot:type.integer",
    "iot:unit": "iot-unit:temperature.si.celsius",
    "iot:minimum": 0,
    "iot:maximum": 50,
};

const gotd = {
    "@value": "168",
    "iot:unit": "iot-unit:temperature.imperial.fahrenheit"
}

describe("cast", function() {
    const from = null;
    describe("simple basics", function() {
        it("undefined value", function() {
            const value = undefined;
            const expect = value;
            const to = {};
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("undefined attribute", function() {
            const value = 10;
            const expect = value;
            const to = undefined;
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("dictionary value", function() {
            const value = 50;
            const from = { "@value": 50 };
            const expect = 50;
            const to = {};
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
    });
    describe("empty attribute", function() {
        it("null", function() {
            const value = null;
            const expect = value;
            const to = {};
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("boolean", function() {
            const value = false;
            const expect = value;
            const to = {};
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("integer", function() {
            const value = 10;
            const expect = value;
            const to = {};
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("number", function() {
            const value = 100.1;
            const expect = value;
            const to = {};
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("string", function() {
            const value = "hello world";
            const expect = value;
            const to = {};
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
    });
    describe("type conversion", function() {
        const from = null;
        describe("to null", function() {
            const to = {
                "iot:type": "iot:type.null",
            };

            it("null", function() {
                const value = null;
                const expect = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("to boolean", function() {
            const to = {
                "iot:type": "iot:type.boolean",
            };

            it("null", function() {
                const value = null;
                const expect = undefined;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = false;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = true;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = true;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = true;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("falsey string", function() {
                const value = "false";
                const expect = false;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("to integer", function() {
            const to = {
                "iot:type": "iot:type.integer",
            };

            it("null", function() {
                const value = null;
                const expect = undefined;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = 0;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = 10;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = 100;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = undefined;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number string", function() {
                const value = "123.3";
                const expect = 123;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("to number", function() {
            const to = {
                "iot:type": "iot:type.number",
            };

            it("null", function() {
                const value = null;
                const from = null;
                const expect = undefined;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const from = null;
                const expect = 0;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const from = null;
                const expect = 10;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const from = null;
                const expect = 100.1;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const from = null;
                const expect = undefined;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number string", function() {
                const value = "123.3";
                const expect = 123.3;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("to string", function() {
            const to = {
                "iot:type": "iot:type.string",
            };

            it("null", function() {
                const value = null;
                const expect = undefined;
                const from = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("boolean", function() {
                const value = false;
                const expect = "0";
                const from = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("integer", function() {
                const value = 10;
                const expect = "10";
                const from = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number", function() {
                const value = 100.1;
                const expect = "100.1";
                const from = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("string", function() {
                const value = "hello world";
                const expect = "hello world";
                const from = null;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("number string", function() {
                const value = "123.3";
                const expect = "123.3";
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
    });
    describe("unit conversion", function() {
        it("no input unit", function() {
            const value = 50;
            const from = {
            }
            const to = {
                "iot:unit": "iot-unit:temperature.si.celsius",
            };
            const expect = 50;
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("no output unit", function() {
            const value = 40;
            const from = {
                "iot:unit": "iot-unit:temperature.si.celsius",
            }
            const to = {
            };
            const expect = 40;
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
        it("input and output unit", function() {
            const value = 212;
            const from = {
                "iot:unit": "iot-unit:temperature.imperial.fahrenheit",
            }
            const to = {
                "iot:unit": "iot-unit:temperature.si.celsius",
            };
            const expect = 100;
            const got = cast.cast(value, from, to);

            assert.strictEqual(got, expect);
        });
    });
    describe("minumum", function() {
        describe("integer", function() {
            it("above minimum", function() {
                const value = 50;
                const from = {
                }
                const to = {
                    "iot:minimum": 10,
                };
                const expect = 50;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("at minimum", function() {
                const value = 10;
                const from = {
                }
                const to = {
                    "iot:minimum": 10,
                };
                const expect = 10;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("below minimum", function() {
                const value = -50;
                const from = {
                }
                const to = {
                    "iot:minimum": 10,
                };
                const expect = 10;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("string", function() {
            it("above minimum", function() {
                const value = "t";
                const from = {
                }
                const to = {
                    "iot:minimum": "h",
                };
                const expect = "t";
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("at minimum", function() {
                const value = "h";
                const from = {
                }
                const to = {
                    "iot:minimum": "h",
                };
                const expect = "h";
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("below minimum", function() {
                const value = "a";
                const from = {
                }
                const to = {
                    "iot:minimum": "h",
                };
                const expect = "h";
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
    });
    describe("minumum", function() {
        describe("integer", function() {
            it("above maximum", function() {
                const value = 50;
                const from = {
                }
                const to = {
                    "iot:maximum": 10,
                };
                const expect = 10;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("at maximum", function() {
                const value = 10;
                const from = {
                }
                const to = {
                    "iot:maximum": 10,
                };
                const expect = 10;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("below maximum", function() {
                const value = -50;
                const from = {
                }
                const to = {
                    "iot:maximum": 10,
                };
                const expect = -50;
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
        describe("string", function() {
            it("above maximum", function() {
                const value = "t";
                const from = {
                }
                const to = {
                    "iot:maximum": "h",
                };
                const expect = "h";
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("at maximum", function() {
                const value = "h";
                const from = {
                }
                const to = {
                    "iot:maximum": "h",
                };
                const expect = "h";
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
            it("below maximum", function() {
                const value = "a";
                const from = {
                }
                const to = {
                    "iot:maximum": "h",
                };
                const expect = "a";
                const got = cast.cast(value, from, to);

                assert.strictEqual(got, expect);
            });
        });
    });
});
