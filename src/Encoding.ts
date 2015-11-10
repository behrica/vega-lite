import * as consts from './consts';
import {X, Y, ROW, COL, SUMMARY, SOURCE, COLOR, DETAIL} from './consts';
import * as util from './util';
import * as vlEncDef from './encdef';
import * as vlEnc from './enc';
import * as schema from './schema/schema';
import * as schemaUtil from './schema/schemautil';

export class Encoding {
  _data: any;
  _marktype: string;
  _enc: any;
  _config: any;

  constructor(spec, theme?) {
    var defaults = schema.instantiate();
    var specExtended = schemaUtil.merge(defaults, theme || {}, spec);

    this._data = specExtended.data;
    this._marktype = specExtended.marktype;
    this._enc = specExtended.encoding;
    this._config = specExtended.config;
  };

  static fromShorthand(shorthand: string, data, config, theme?) {
    var c = consts.shorthand,
      split = shorthand.split(c.delim),
      marktype = split.shift().split(c.assign)[1].trim(),
      enc = vlEnc.fromShorthand(split);

    return new Encoding({
      data: data,
      marktype: marktype,
      encoding: enc,
      config: config
    }, theme);
  }

  static fromSpec(spec, theme?) {
    return new Encoding(spec, theme);
  };

  toShorthand() {
    var c = consts.shorthand;
    return 'mark' + c.assign + this._marktype +
      c.delim + vlEnc.shorthand(this._enc);
  };

  static shorthand(spec) {
    var c = consts.shorthand;
    return 'mark' + c.assign + spec.marktype +
      c.delim + vlEnc.shorthand(spec.encoding);
  };

  static specFromShorthand(shorthand: string, data, config, excludeConfig?) {
    return Encoding.fromShorthand(shorthand, data, config).toSpec(excludeConfig);
  };

  toSpec(excludeConfig?, excludeData?) {
    var enc = util.duplicate(this._enc),
      spec;

    spec = {
      marktype: this._marktype,
      encoding: enc
    };

    if (!excludeConfig) {
      spec.config = util.duplicate(this._config);
    }

    if (!excludeData) {
      spec.data = util.duplicate(this._data);
    }

    // remove defaults
    var defaults = schema.instantiate();
    return schemaUtil.subtract(spec, defaults);
  };

  marktype() {
    return this._marktype;
  };

  is(m) {
    return this._marktype === m;
  };

  has(encType) {
    // equivalent to calling vlenc.has(this._enc, encType)
    return this._enc[encType].name !== undefined;
  };

  encDef(et) {
    return this._enc[et];
  };

  // get "field" reference for vega
  fieldRef(et: string, opt?) {
    opt = opt || {};
    return vlEncDef.fieldRef(this._enc[et], opt);
  };

  /*
   * return key-value pairs of field name and list of fields of that field name
   */
  fields() {
    return vlEnc.fields(this._enc);
  };

  fieldTitle(et) {
    if (vlEncDef.isCount(this._enc[et])) {
      return vlEncDef.COUNT_DISPLAYNAME;
    }
    var fn = this._enc[et].aggregate || this._enc[et].timeUnit || (this._enc[et].bin && 'bin');
    if (fn) {
      return fn.toUpperCase() + '(' + this._enc[et].name + ')';
    } else {
      return this._enc[et].name;
    }
  };

  scale(et: string) {
    return this._enc[et].scale || {};
  };

  axis(et: string) {
    return this._enc[et].axis || {};
  };

  bandWidth(encType, useSmallBand?: boolean) {
    if (this.encDef(encType).scale.bandWidth !== undefined) {
      // explicit value
      return this.encDef(encType).scale.bandWidth;
    }

    // If not specified, draw value from config.

    useSmallBand = useSmallBand ||
    //isBandInSmallMultiples
    (encType === Y && this.has(ROW) && this.has(Y)) ||
    (encType === X && this.has(COL) && this.has(X));

    return this.config(useSmallBand ? 'smallBandWidth' : 'largeBandWidth');
  };

  padding(encType) {
    if (this.encDef(encType).scale.padding !== undefined) {
      // explicit value
      return this.encDef(encType).scale.padding;
    }
    if (encType === ROW || encType === COL) {
      return this.config('cellPadding');
    }
    return this.config('padding');
  };

  // returns false if binning is disabled, otherwise an object with binning properties
  bin(et) {
    var bin = this._enc[et].bin;
    if (bin === {})
      return false;
    if (bin === true)
      return {
        maxbins: schema.MAXBINS_DEFAULT
      };
    return bin;
  };

  value(et) {
    return this._enc[et].value;
  };

  numberFormat = function(/*name*/) {
    // TODO(#497): have different number format based on numberType (discrete/continuous)
    return this.config('numberFormat');
  };

  map(f) {
    return vlEnc.map(this._enc, f);
  };

  reduce(f, init) {
    return vlEnc.reduce(this._enc, f, init);
  };

  forEach(f) {
    return vlEnc.forEach(this._enc, f);
  };

  type(et) {
    return this.has(et) ? this._enc[et].type : null;
  };

  isType(et, type) {
    var encDef = this.encDef(et);
    return encDef && vlEncDef.isType(encDef, type);
  };


  isTypes(et, type) {
    var encDef = this.encDef(et);
    return encDef && vlEncDef.isTypes(encDef, type);
  };

  static isOrdinalScale(encoding, encType) {
    return vlEncDef.isOrdinalScale(encoding.encDef(encType));
  };

  static isDimension(encoding, encType) {
    return vlEncDef.isDimension(encoding.encDef(encType));
  };

  static isMeasure(encoding, encType) {
    return vlEncDef.isMeasure(encoding.encDef(encType));
  };

  isOrdinalScale(encType) {
    return this.has(encType) && Encoding.isOrdinalScale(this, encType);
  };

  isDimension(encType) {
    return this.has(encType) && Encoding.isDimension(this, encType);
  };

  isMeasure(encType) {
    return this.has(encType) && Encoding.isMeasure(this, encType);
  };

  isAggregate() {
    return vlEnc.isAggregate(this._enc);
  };

  dataTable() {
    return this.isAggregate() ? SUMMARY : SOURCE;
  };

  static isAggregate(spec) {
    return vlEnc.isAggregate(spec.encoding);
  };

  static alwaysNoOcclusion(spec) {
    // FIXME raw OxQ with # of rows = # of O
    return vlEnc.isAggregate(spec.encoding);
  };

  static isStack(spec) {
    // FIXME update this once we have control for stack ...
    return (spec.marktype === 'bar' || spec.marktype === 'area') &&
      !!spec.encoding.color;
  };

  /**
   * Check if the encoding should be stacked and return the stack dimenstion and value fields.
   * @return {Object} An object containing two properties:
   * - dimension - the dimension field
   * - value - the value field
   */
  stack() {
    var stack = (this.has(COLOR) && this.encDef(COLOR).stack) ? COLOR :
      (this.has(DETAIL) && this.encDef(DETAIL).stack) ? DETAIL :
        null;

    var properties = stack && this.encDef(stack).stack !== true ?
      this.encDef(stack).stack :
      {};

    if ((this.is('bar') || this.is('area')) && stack && this.isAggregate()) {

      var isXMeasure = this.isMeasure(X);
      var isYMeasure = this.isMeasure(Y);

      if (isXMeasure && !isYMeasure) {
        return {
          groupby: Y,
          value: X,
          stack: stack,
          properties: properties
        };
      } else if (isYMeasure && !isXMeasure) {
        return {
          groupby: X,
          value: Y,
          stack: stack,
          properties: properties
        };
      }
    }
    return null; // no stack encoding
  };

  details() {
    var encoding = this;
    return this.reduce(function(refs, field, encType) {
      if (!field.aggregate && (encType !== X && encType !== Y)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  };

  facets() {
    var encoding = this;
    return this.reduce(function(refs, field, encType) {
      if (!field.aggregate && (encType == ROW || encType == COL)) {
        refs.push(encoding.fieldRef(encType));
      }
      return refs;
    }, []);
  };

  cardinality(encType, stats) {
    return vlEncDef.cardinality(this.encDef(encType), stats, this.config('filterNull'));
  };

  isRaw() {
    return !this.isAggregate();
  };

  data() {
    return this._data;
  };

  // returns whether the encoding has values embedded
  hasValues() {
    var vals = this.data().values;
    return vals && vals.length;
  };

  config(name) {
    return this._config[name];
  };

  static transpose(spec) {
    var oldenc = spec.encoding,
      enc = util.duplicate(spec.encoding);
    enc.x = oldenc.y;
    enc.y = oldenc.x;
    enc.row = oldenc.col;
    enc.col = oldenc.row;
    spec.encoding = enc;
    return spec;
  };
}
