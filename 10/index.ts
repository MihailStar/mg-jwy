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

  const insertedUsers = await users.insertMany([
    { name: 'name1', age: 31 },
    { name: 'name2', age: 32 },
    { name: 'name3', age: 33 },
  ]);

  const foundUsersLimit2 = await users.find({}).limit(2).toArray();
  console.log({ foundUsersLimit2 });

  const firstUserId = insertedUsers.insertedIds[0];
  const foundUser1 = await users.findOne({ _id: firstUserId });
  console.log({ foundUser1 });

  const foundUser2 = await users.findOne({ age: 31 });
  console.log({ foundUser2 });

  await db.dropCollection(collectionName);
  await db.dropDatabase();
}

bootstrap()
  .catch(console.error)
  .finally(() => {
    mongoClient.close().catch(console.error);
  });
