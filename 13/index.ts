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

  const deletedUserData = await users.deleteOne({ name: 'name1' });
  console.log({ deletedUserData });

  const allUsers = await users.find({}).toArray();
  console.log({ allUsers });

  await db.dropCollection(collectionName);
  await db.dropDatabase();
}

bootstrap()
  .catch(console.error)
  .finally(() => {
    mongoClient.close().catch(console.error);
  });
