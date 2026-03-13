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
    averageRating: async (event) => {
      const row = await db('feedback').where('event_id', event.id).avg('rating as avg').first();
      return row?.avg ?? null;
    },
    reviewCount: async (event) => {
      const row = await db('feedback').where('event_id', event.id).count('* as count').first();
      return Number(row?.count ?? 0);
    },
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
