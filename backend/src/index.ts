import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'node:fs';
import { Resolvers } from './generated/graphql.js';
import db from './db.js';

const typeDefs = readFileSync('../schemas/schema.graphql', { encoding: 'utf-8' });

const resolvers: Resolvers = {
  Query: {
    events: () => db('events').select(),
    event: (_, { id }) => db('events').where({ id }).first(),
  },
  Event: {
    feedback: (event) => db('feedback').where({ event_id: event.id }),
  },
  Feedback: {
    userName: (feedback) => feedback.user_name,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
