import { BaseModel, IntField, NumericField, Model, ManyToOne, StringField } from 'warthog';

import BN from 'bn.js';

import { Location } from '../location/location.model';
import { PublicConfig } from '../public-config/public-config.model';

@Model({ api: {} })
export class Node extends BaseModel {
  @IntField({})
  gridVersion!: number;

  @IntField({})
  nodeId!: number;

  @IntField({})
  farmId!: number;

  @IntField({})
  twinId!: number;

  @ManyToOne(
    () => Location,
    (param: Location) => param.nodelocation,
    {
      skipGraphQLField: true,

      modelName: 'Node',
      relModelName: 'Location',
      propertyName: 'location'
    }
  )
  location!: Location;

  @IntField({
    nullable: true
  })
  countryId?: number;

  @IntField({
    nullable: true
  })
  cityId?: number;

  @StringField({})
  address!: string;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined
    }
  })
  hru?: BN;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined
    }
  })
  sru?: BN;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined
    }
  })
  cru?: BN;

  @NumericField({
    nullable: true,

    transformer: {
      to: (entityValue: BN) => (entityValue !== undefined ? entityValue.toString(10) : null),
      from: (dbValue: string) =>
        dbValue !== undefined && dbValue !== null && dbValue.length > 0 ? new BN(dbValue, 10) : undefined
    }
  })
  mru?: BN;

  @StringField({})
  role!: string;

  @ManyToOne(
    () => PublicConfig,
    (param: PublicConfig) => param.nodepublicConfig,
    {
      skipGraphQLField: true,
      nullable: true,
      modelName: 'Node',
      relModelName: 'PublicConfig',
      propertyName: 'publicConfig'
    }
  )
  publicConfig?: PublicConfig;

  constructor(init?: Partial<Node>) {
    super();
    Object.assign(this, init);
  }
}
