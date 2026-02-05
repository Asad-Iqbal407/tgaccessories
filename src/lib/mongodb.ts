import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let clientPromise: Promise<MongoClient>;

if (!uri) {
  clientPromise = Promise.reject(new Error('MONGODB_URI is not set'));
} else if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(global as any)._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any)._mongoClientPromise = client.connect();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clientPromise = (global as any)._mongoClientPromise;
} else {
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
