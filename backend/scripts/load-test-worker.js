import { workerData, parentPort } from "node:worker_threads";
import { performance } from "node:perf_hooks";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client/core/index.js";
import { uniqueNamesGenerator, names } from "unique-names-generator";
import { LoremIpsum } from "lorem-ipsum";

const ADD_FEEDBACK = gql`
	mutation AddFeedback(
		$eventId: ID!
		$userName: String!
		$rating: Int!
		$description: String!
	) {
		addFeedback(
			eventId: $eventId
			userName: $userName
			rating: $rating
			description: $description
		) {
			id
			eventId
			userName
			rating
			description
		}
	}
`;

const { workerId, eventIds, submissions } = workerData;

const eventId = eventIds[Math.floor(Math.random() * eventIds.length)];
const client = new ApolloClient({
	link: new HttpLink({ uri: "http://localhost:4000/" }),
	cache: new InMemoryCache(),
});
const lorem = new LoremIpsum();

const tasks = Array.from({ length: submissions }, async () => {
	const userName = uniqueNamesGenerator({ dictionaries: [names], style: "capital" });
	const description = lorem.generateSentences(1);
	const rating = Math.floor(Math.random() * 5) + 1;

	const start = performance.now();
	await client.mutate({
		mutation: ADD_FEEDBACK,
		variables: { eventId, userName, rating, description },
	});
	return performance.now() - start;
});

const durations = await Promise.all(tasks);

parentPort.postMessage({ workerId, eventId, durations });
