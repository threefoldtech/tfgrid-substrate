import { SubstrateEvent, DB } from '../generated/hydra-processor'
import { Entity } from '../generated/graphql-server/src/modules/entity/entity.model'
import BN from 'bn.js'
import { hex2a } from './util'

export async function tfgridModule_EntityStored(db: DB, event: SubstrateEvent) {
  const [entity_id, name, country_id, city_id, pub_key] = event.params
  const entity = new Entity()
  entity.entityId = new BN(entity_id.value as number)
  entity.name = hex2a(Buffer.from(name.value as string).toString())
  entity.countryId = new BN(country_id.value as number)
  entity.cityId = new BN(city_id.value as number)
  entity.pubKey = Buffer.from(pub_key.value as string).toString()

  await db.save<Entity>(entity)
}

export async function tfgridModule_EntityUpdated(db: DB, event: SubstrateEvent) {
  const [entity_id, name, country_id, city_id, pub_key] = event.params

  const savedEntity = await db.get(Entity, { where: { entityId: new BN(entity_id.value as number) } })

  if (savedEntity) {
    savedEntity.entityId = new BN(entity_id.value as number)
    savedEntity.name = hex2a(Buffer.from(name.value as string).toString())
    savedEntity.countryId = new BN(country_id.value as number)
    savedEntity.cityId = new BN(city_id.value as number)
    savedEntity.pubKey = Buffer.from(pub_key.value as string).toString()
  
    await db.save<Entity>(savedEntity)
  }
}

export async function tfgridModule_EntityDeleted(db: DB, event: SubstrateEvent) {
  const [entity_id] = event.params

  const savedEntity = await db.get(Entity, { where: { entityId: new BN(entity_id.value as number) } })

  if (savedEntity) {
    await db.remove(savedEntity)
  }
}
