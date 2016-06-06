# iotdb-thing
IOTDB Module for Managing Things

<img src="https://raw.githubusercontent.com/dpjanes/iotdb-homestar/master/docs/HomeStar.png" align="right" />

# Introduction 

This is a radical rewriting of our Thing manipulation library.

# Examples

## Bands

    thing_1.band("istate").state();
    thing_1.band("ostate").state();

## Shortcuts

### Turn a light on

    thing_1 = thing.make()
    thing_1.set(":on", true);

### get
