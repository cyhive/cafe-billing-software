import { MongoClient, Db, Collection } from 'mongodb';
import type { Bill, CafeSettings, MenuItem, RawMaterial } from '../src/types/index.js';
import { INITIAL_CAFE_SETTINGS, INITIAL_MENU_ITEMS } from '../src/data/initialMenu.js';
import { DEFAULT_RAW_MATERIALS, DEFAULT_RECIPES } from '../src/data/rawMaterials.js';

type SettingsDoc = CafeSettings & { _id: string };
type CounterDoc = { _id: string; value: number };

let db: Db | null = null;

export async function connectDb(): Promise<Db> {
  if (db) return db;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to the .env file (see .env.example).');
  }
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000, ignoreUndefined: true });
  await client.connect();
  db = client.db(process.env.MONGODB_DB || 'nu_cafe');

  await Promise.all([
    menuItems().createIndex({ id: 1 }, { unique: true }),
    bills().createIndex({ id: 1 }, { unique: true }),
    bills().createIndex({ createdAt: -1 }),
    rawMaterials().createIndex({ id: 1 }, { unique: true }),
  ]);
  return db;
}

const getDb = () => {
  if (!db) throw new Error('Database not connected');
  return db;
};

export const menuItems = (): Collection<MenuItem> => getDb().collection<MenuItem>('menuItems');
export const bills = (): Collection<Bill> => getDb().collection<Bill>('bills');
export const rawMaterials = (): Collection<RawMaterial> =>
  getDb().collection<RawMaterial>('rawMaterials');
export const settings = (): Collection<SettingsDoc> => getDb().collection<SettingsDoc>('settings');
const counters = (): Collection<CounterDoc> => getDb().collection<CounterDoc>('counters');

export const SETTINGS_ID = 'store';

/** Atomically increments a named counter and returns the new value. */
export async function nextCounter(name: string, start: number): Promise<number> {
  await counters().updateOne({ _id: name }, { $setOnInsert: { value: start } }, { upsert: true });
  const doc = await counters().findOneAndUpdate(
    { _id: name },
    { $inc: { value: 1 } },
    { returnDocument: 'after' }
  );
  return doc!.value;
}

/** Replaces the whole menu with the default NU Cafe menu. */
export async function resetMenu(): Promise<void> {
  await menuItems().deleteMany({});
  await menuItems().insertMany(INITIAL_MENU_ITEMS.map((item) => ({ ...item })));
}

/** Seeds the menu and settings on first run; leaves existing data alone. */
export async function seedIfEmpty(): Promise<void> {
  if ((await menuItems().countDocuments()) === 0) {
    await resetMenu();
    console.log(`Seeded ${INITIAL_MENU_ITEMS.length} menu items`);
  }
  await settings().updateOne(
    { _id: SETTINGS_ID },
    { $setOnInsert: { ...INITIAL_CAFE_SETTINGS } },
    { upsert: true }
  );

  await seedRawMaterials();
}

// Bump when DEFAULT_RAW_MATERIALS / DEFAULT_RECIPES gain new entries
const RAW_MATERIALS_SEED_VERSION = 2;

/**
 * Adds default raw materials that don't exist yet and gives menu items that
 * have no recipe their default one. Existing stock and edited recipes are kept.
 */
async function seedRawMaterials(): Promise<void> {
  const seeded = (await counters().findOne({ _id: 'rawMaterialsSeedVersion' }))?.value ?? 0;
  if (seeded >= RAW_MATERIALS_SEED_VERSION) return;

  const existing = new Set((await rawMaterials().find({}, { projection: { id: 1 } }).toArray()).map((m) => m.id));
  const missing = DEFAULT_RAW_MATERIALS.filter((m) => !existing.has(m.id));
  if (missing.length) await rawMaterials().insertMany(missing.map((m) => ({ ...m })));

  const results = await Promise.all(
    Object.entries(DEFAULT_RECIPES).map(([id, recipe]) =>
      menuItems().updateOne({ id, recipe: { $exists: false } }, { $set: { recipe } })
    )
  );
  const recipesAdded = results.filter((r) => r.modifiedCount).length;

  await counters().updateOne(
    { _id: 'rawMaterialsSeedVersion' },
    { $set: { value: RAW_MATERIALS_SEED_VERSION } },
    { upsert: true }
  );
  console.log(`Added ${missing.length} raw materials and ${recipesAdded} default recipes`);
}
