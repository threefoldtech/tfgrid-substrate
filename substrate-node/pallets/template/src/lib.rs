#![cfg_attr(not(feature = "std"), no_std)]

/// Edit this file to define custom logic or remove it if it is not needed.
/// Learn more about FRAME and the core library of Substrate FRAME pallets:
/// https://substrate.dev/docs/en/knowledgebase/runtime/frame

use frame_support::{decl_module, decl_storage, decl_event, decl_error, dispatch, traits::Get, ensure};
use frame_system::ensure_signed;
use frame_support::traits::Vec;

#[cfg(test)]
mod tests;

mod types;

pub trait Trait: frame_system::Trait {
	type Event: From<Event<Self>> + Into<<Self as frame_system::Trait>::Event>;
}

decl_storage! {
	trait Store for Module<T: Trait> as TemplateModule {
		pub Farms get(fn farms): map hasher(blake2_128_concat) u64 => types::Farm; 
		pub Nodes get(fn nodes): map hasher(blake2_128_concat) u64 => types::Node;
		pub Entities get(fn entities): map hasher(blake2_128_concat) u64 => types::Entity;
		pub EntitiesByNameID get(fn entities_by_name_id): map hasher(blake2_128_concat) Vec<u8> => u64;
		pub Twins get(fn twins): map hasher(blake2_128_concat) u64 => types::Twin;
		pub TwinsByPubkeyID get(fn twins_by_pubkey_id): map hasher(blake2_128_concat) Vec<u8> => u64;

		// ID maps
		FarmID: u64;
		NodeID: u64;
		EntityID: u64;
		TwinID: u64;
	}
}

decl_event!(
	pub enum Event<T> where AccountId = <T as frame_system::Trait>::AccountId {
		SomethingStored(u32, AccountId),
		FarmStored(u64),
		NodeStored(u64),
		EntityStored(Vec<u8>),
		TwinStored(Vec<u8>),
	}
);

decl_error! {
	pub enum Error for Module<T: Trait> {
		NoneValue,
		StorageOverflow,
		FarmNotExists,
		EntityExists,
		EntityNotExists,
		TwinExists,
	}
}

decl_module! {
	pub struct Module<T: Trait> for enum Call where origin: T::Origin {
		type Error = Error<T>;

		fn deposit_event() = default;

		#[weight = 10_000 + T::DbWeight::get().writes(1)]
		pub fn create_farm(origin,
			name: Vec<u8>,
			entity_id: u64,
			twin_id: u64,
			pricing_policy_id: u64,
			certification_type: types::CertificationType,
			country_id: u64,
			city_id: u64) -> dispatch::DispatchResult {
			let _ = ensure_signed(origin)?;

			let id = FarmID::get();

			let farm = types::Farm {
				id,
				name,
				entity_id,
				twin_id,
				pricing_policy_id,
				country_id,
				city_id,
				certification_type
			};

			Farms::insert(id, &farm);
			FarmID::put(id + 1);

			Self::deposit_event(RawEvent::FarmStored(id));

			Ok(())
		}

		#[weight = 10_000 + T::DbWeight::get().writes(1)]
		pub fn create_node(origin,
			farm_id: u64,
			twin_id: u64,
			resources: types::Resources,
			location: types::Location,
			country_id: u64,
			city_id: u64) -> dispatch::DispatchResult {
			let _ = ensure_signed(origin)?;

			ensure!(!Farms::contains_key(&farm_id), Error::<T>::FarmNotExists);

			let id = NodeID::get();

			let node = types::Node {
				id,
				farm_id,
				twin_id,
				resources,
				location,
				country_id,
				city_id
			};

			Nodes::insert(id, &node);
			NodeID::put(id + 1);

			Self::deposit_event(RawEvent::NodeStored(id));

			Ok(())
		}

		#[weight = 10_000 + T::DbWeight::get().writes(1)]
		pub fn create_entity(origin, name: Vec<u8>, country_id: u64, city_id: u64) -> dispatch::DispatchResult {
			let _ = ensure_signed(origin)?;

			ensure!(!EntitiesByNameID::contains_key(&name), Error::<T>::EntityExists);

			let id = EntityID::get();

			let entity = types::Entity {
				id,
				name: name.clone(),
				country_id,
				city_id,
			};

			Entities::insert(&id, &entity);
			EntitiesByNameID::insert(&name, id);
			EntityID::put(id + 1);

			Self::deposit_event(RawEvent::EntityStored(name));

			Ok(())
		}

		#[weight = 10_000 + T::DbWeight::get().writes(1)]
		pub fn create_twin(origin, pubkey: Vec<u8>, entity_id: u64) -> dispatch::DispatchResult {
			let _ = ensure_signed(origin)?;

			ensure!(!TwinsByPubkeyID::contains_key(&pubkey), Error::<T>::TwinExists);

			ensure!(Entities::contains_key(entity_id), Error::<T>::EntityNotExists);

			let id = TwinID::get();

			let twin = types::Twin {
				id,
				pubkey: pubkey.clone(),
				entity_id,
			};

			Twins::insert(&id, &twin);
			TwinsByPubkeyID::insert(&pubkey, &id);
			TwinID::put(id + 1);

			Self::deposit_event(RawEvent::TwinStored(pubkey));
			
			Ok(())
		}
	}
}