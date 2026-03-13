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
    // TODO: would love to get rid of this any; needs some work to get knex types and auto camel-case conversion set up
    userName: (feedback: any) => feedback.user_name,
    eventId: (feedback: any) => feedback.event_id,
  },
  Mutation: {
    addFeedback: async (_, { eventId, userName, rating, description }) => {
      const [id] = await db('feedback').insert({
        event_id: eventId,
        user_name: userName,
        rating,
        description,
      });
      return db('feedback').where({ id }).first();
    },
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
