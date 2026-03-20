#!/usr/bin/env -S npx tsx
import { gql } from "@apollo/client/core";
import { Command } from "commander";
import { uniqueNamesGenerator, names } from "unique-names-generator";
import { LoremIpsum } from "lorem-ipsum";
import { createClient } from "./client.js";
import type {
	GetEventsQuery,
	AddFeedbackMutation,
	AddFeedbackMutationVariables,
} from "./generated/graphql.js";

const GET_EVENTS = gql`
	query GetEvents {
		events {
			id
			name
		}
	}
`;

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

const program = new Command();
program.option("--event-id <id>", "Event ID to submit feedback for").parse(process.argv);

const opts = program.opts<{ eventId?: string }>();

const client = createClient();
const lorem = new LoremIpsum();

let eventIds: string[];

if (opts.eventId) {
	eventIds = [opts.eventId];
} else {
	const result = await client.query<GetEventsQuery>({ query: GET_EVENTS });
	const events = result.data?.events ?? [];
	if (events.length === 0) {
		console.error("No events found. Create one first with yarn create-event.");
		process.exit(1);
	}
	eventIds = events.map((e) => e.id);
	console.log(`Loaded ${eventIds.length} event(s): ${eventIds.join(", ")}`);
}

function randomDelay(): number {
	return Math.floor(Math.random() * 4000) + 1000;
}

async function submitFeedback() {
	const eventId = eventIds[Math.floor(Math.random() * eventIds.length)];
	const userName = uniqueNamesGenerator({ dictionaries: [names], style: "capital" });
	const description = lorem.generateSentences(1);
	const rating = Math.floor(Math.random() * 5) + 1;

	const result = await client.mutate<AddFeedbackMutation, AddFeedbackMutationVariables>({
		mutation: ADD_FEEDBACK,
		variables: { eventId, userName, rating, description },
	});

	const fb = result.data?.addFeedback;
	console.log(`[feedback ${fb?.id}] event=${fb?.eventId} user="${fb?.userName}" rating=${fb?.rating}`);

	setTimeout(submitFeedback, randomDelay());
}

setTimeout(submitFeedback, randomDelay());
