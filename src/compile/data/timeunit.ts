import {TimeUnitTransform as VgTimeUnitTransform} from 'vega';
import {getSecondaryRangeChannel} from '../../channel';
import {hasBand, vgField} from '../../channeldef';
import {getTimeUnitParts, normalizeTimeUnit} from '../../timeunit';
import {TimeUnitTransform} from '../../transform';
import {Dict, duplicate, hash, keys, vals} from '../../util';
import {isUnitModel, ModelWithField} from '../model';
import {DataFlowNode} from './dataflow';

export type TimeUnitComponent = TimeUnitTransform & {
  /** whether to output time unit as a band (generate two formula including start and end) */
  band?: boolean;
};

export class TimeUnitNode extends DataFlowNode {
  public clone() {
    return new TimeUnitNode(null, duplicate(this.formula));
  }

  constructor(parent: DataFlowNode, private formula: Dict<TimeUnitComponent>) {
    super(parent);
  }

  public static makeFromEncoding(parent: DataFlowNode, model: ModelWithField) {
    const formula = model.reduceFieldDef((timeUnitComponent: TimeUnitComponent, fieldDef, channel) => {
      const {field} = fieldDef;
      const timeUnitParams = normalizeTimeUnit(fieldDef.timeUnit);

      const channelDef2 = isUnitModel(model) ? model.encoding[getSecondaryRangeChannel(channel)] : undefined;

      const band = isUnitModel(model) && hasBand(channel, fieldDef, channelDef2, model.markDef, model.config);

      if (timeUnitParams) {
        const {units: timeUnit, step, timezone} = timeUnitParams;

        const as = vgField(fieldDef, {forAs: true});
        timeUnitComponent[
          hash({
            as,
            timeUnit,
            step,
            timezone,
            field
          })
        ] = {
          as,
          timeUnit,
          step,
          timezone,
          field,
          ...(band ? {band: true} : {})
        };
      }
      return timeUnitComponent;
    }, {} as Dict<TimeUnitComponent>);

    if (keys(formula).length === 0) {
      return null;
    }

    return new TimeUnitNode(parent, formula);
  }

  public static makeFromTransform(parent: DataFlowNode, t: TimeUnitTransform) {
    const component = {...t};

    return new TimeUnitNode(parent, {
      [hash(component)]: component
    });
  }

  /**
   * Merge together TimeUnitNodes assigning the children of `other` to `this`
   * and removing `other`.
   */
  public merge(other: TimeUnitNode) {
    this.formula = {...this.formula};

    // if the same hash happen twice, merge "band"
    for (const key in other.formula) {
      if (!this.formula[key] || other.formula[key].band) {
        // copy if it's not a duplicate or if we need to include copy band over
        this.formula[key] = other.formula[key];
      }
    }

    for (const child of other.children) {
      other.removeChild(child);
      child.parent = this;
    }

    other.remove();
  }

  public producedFields() {
    return new Set(vals(this.formula).map(f => f.as));
  }

  public dependentFields() {
    return new Set(vals(this.formula).map(f => f.field));
  }

  public hash() {
    return `TimeUnit ${hash(this.formula)}`;
  }

  public assemble() {
    const transforms: VgTimeUnitTransform[] = [];

    for (const f of vals(this.formula)) {
      const {field, as} = f;
      const timeUnitParams = normalizeTimeUnit(f.timeUnit);

      transforms.push({
        field,
        type: 'timeunit',
        ...{units: getTimeUnitParts(timeUnitParams?.units)},
        ...{step: timeUnitParams?.step},
        ...{timezone: timeUnitParams?.timezone},
        as: [as, `${as}_end`]
      });
    }

    return transforms;
  }
}
