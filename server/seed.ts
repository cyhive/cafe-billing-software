// Seeds MongoDB with the NU Cafe menu and store settings.
//   npm run seed           -> only fills an empty database
//   npm run seed -- --reset -> replaces the whole menu with the default menu
import 'dotenv/config';
import { connectDb, menuItems, resetMenu, seedIfEmpty } from './db.js';

async function main() {
  await connectDb();
  if (process.argv.includes('--reset')) {
    await resetMenu();
    console.log('Menu replaced with the default NU Cafe menu');
  }
  await seedIfEmpty();
  console.log(`Menu now has ${await menuItems().countDocuments()} items`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
