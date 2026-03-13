import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { PubSub, withFilter } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/use/ws';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { WebSocketServer } from 'ws';
import { Resolvers } from './generated/graphql.js';
import db from './db.js';

const pubsub = new PubSub();

const typeDefs = readFileSync('../schemas/schema.graphql', { encoding: 'utf-8' });

const resolvers: Resolvers = {
  Query: {
    events: () => db('events').select(),
    event: (_, { id }) => db('events').where({ id }).first(),
  },
  Event: {
    feedback: (event, { minRating, maxRating }) => {
      let query = db('feedback').where({ event_id: event.id });
      if (minRating != null) query = query.where('rating', '>=', minRating);
      if (maxRating != null) query = query.where('rating', '<=', maxRating);
      return query;
    },
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
      const feedback = await db('feedback').where({ id }).first();
      await pubsub.publish(`FEEDBACK_ADDED.${eventId}`, { feedbackAdded: feedback });
      return feedback;
    },
  },
  Subscription: {
    feedbackAdded: {
      subscribe: withFilter(
        (_, { eventId }) => pubsub.asyncIterableIterator(`FEEDBACK_ADDED.${eventId}`),
        // TODO: another annoying any here
        (payload: any, { minRating, maxRating }) => {
          const rating = payload.feedbackAdded.rating;
          if (minRating != null && rating < minRating) return false;
          if (maxRating != null && rating > maxRating) return false;
          return true;
        }
      ),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Standalone WebSocket server on port 4001 for subscriptions
const wsHttpServer = createServer();
const wsServer = new WebSocketServer({ server: wsHttpServer, path: '/' });
useServer({ schema }, wsServer);
wsHttpServer.listen(4001, () => {
  console.log('Subscriptions ready at ws://localhost:4001/');
});

// Apollo HTTP server on port 4000
const server = new ApolloServer({ schema });
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`Server ready at ${url}`);
