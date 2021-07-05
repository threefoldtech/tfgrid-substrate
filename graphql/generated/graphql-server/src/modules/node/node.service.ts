import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { WhereInput } from 'warthog';
import { WarthogBaseService } from '../../WarthogBaseService';

import { Node } from './node.model';

import {} from '../variants/variants.model';

import { NodeWhereArgs, NodeWhereInput } from '../../../generated';

import { Location } from '../location/location.model';
import { LocationService } from '../location/location.service';
import { getConnection, getRepository, In, Not } from 'typeorm';
import _ from 'lodash';

@Service('NodeService')
export class NodeService extends WarthogBaseService<Node> {
  @Inject('LocationService')
  public readonly locationService!: LocationService;

  constructor(@InjectRepository(Node) protected readonly repository: Repository<Node>) {
    super(Node, repository);
  }

  async find<W extends WhereInput>(
    where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Node[]> {
    let f = fields || [];

    return this.findWithRelations<W>(where, orderBy, limit, offset, f);
  }

  async findWithRelations<W extends WhereInput>(
    _where?: any,
    orderBy?: string | string[],
    limit?: number,
    offset?: number,
    fields?: string[]
  ): Promise<Node[]> {
    const where = <NodeWhereInput>(_where || {});

    // remove relation filters to enable warthog query builders
    const { location } = where;
    delete where.location;

    let mainQuery = this.buildFindQueryWithParams(<any>where, orderBy, undefined, fields, 'main').take(undefined); // remove LIMIT

    let parameters = mainQuery.getParameters();

    if (location) {
      // OTO or MTO
      const locationQuery = this.locationService
        .buildFindQueryWithParams(<any>location, undefined, undefined, ['id'], 'location')
        .take(undefined); // remove the default LIMIT

      mainQuery = mainQuery.andWhere(`"node"."location_id" IN (${locationQuery.getQuery()})`);

      parameters = { ...parameters, ...locationQuery.getParameters() };
    }

    mainQuery = mainQuery.setParameters(parameters);

    return mainQuery
      .take(limit || 50)
      .skip(offset || 0)
      .getMany();
  }
}
