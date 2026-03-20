#!/usr/bin/env -S npx tsx
import { gql } from "@apollo/client/core";
import { Command } from "commander";
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from "unique-names-generator";
import { createClient } from "./client.js";
import type { CreateEventMutation, CreateEventMutationVariables } from "./generated/graphql.js";

const CREATE_EVENT = gql`
	mutation CreateEvent($name: String!) {
		createEvent(name: $name) {
			id
			name
		}
	}
`;

const program = new Command();
program
	.option("--name <name>", "Event name")
	.parse(process.argv);

const opts = program.opts<{ name?: string }>();
const name =
	opts.name ??
	uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: " ", style: "capital" });

const client = createClient();
const result = await client.mutate<CreateEventMutation, CreateEventMutationVariables>({
	mutation: CREATE_EVENT,
	variables: { name },
});

const event = result.data?.createEvent;
console.log(JSON.stringify(event, null, 2));
