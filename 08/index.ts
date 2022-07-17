import { MongoClient } from 'mongodb';

type User = {
  name: string;
  age: number;
};

const url = 'mongodb://localhost:27017';
const mongoClient = new MongoClient(url);
const dbName = 'mongo';
const collectionName = 'users';

async function bootstrap(): Promise<void> {
  await mongoClient.connect();
  console.log('Successfully connected to database');

  const db = mongoClient.db(dbName);
  const users = db.collection<User>(collectionName);

  await users.insertMany([
    { name: 'name1', age: 31 },
    { name: 'name2', age: 32 },
    { name: 'name3', age: 33 },
  ]);

  const lessThan33 = await users.find({ age: { $lt: 33 } }).toArray();
  console.log({ lessThan33 });

  const lessThanEquals33 = await users.find({ age: { $lte: 33 } }).toArray();
  console.log({ lessThanEquals33 });

  const greaterThan31 = await users.find({ age: { $gt: 31 } }).toArray();
  console.log({ greaterThan31 });

  const greaterThanEquals31 = await users.find({ age: { $gte: 31 } }).toArray();
  console.log({ greaterThanEquals31 });

  const notEquals32 = await users.find({ age: { $ne: 32 } }).toArray();
  console.log({ notEquals32 });

  await db.dropCollection(collectionName);
  await db.dropDatabase();
}

bootstrap()
  .catch(console.error)
  .finally(() => {
    mongoClient.close().catch(console.error);
  });
