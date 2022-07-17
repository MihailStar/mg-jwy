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

  const foundUsers1 = await users.find({ age: 33 }).toArray();
  console.log({ foundUsers1 });

  const foundUsers21 = await users
    .find({ age: 33, name: 'not-exist' })
    .toArray();
  console.log({ foundUsers21 }); // -> { foundUsers21: [] }

  const foundUsers22 = await users.findOne({ age: 33, name: 'not-exist' });
  console.log({ foundUsers22 }); // -> { foundUsers22: null }

  const foundUsers3 = await users.find({ age: 33, name: 'name3' }).toArray();
  console.log({ foundUsers3 });

  await db.dropCollection(collectionName);
  await db.dropDatabase();
}

bootstrap()
  .catch(console.error)
  .finally(() => {
    mongoClient.close().catch(console.error);
  });
