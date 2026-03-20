import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { GQL_HTTP_URL, GQL_WS_URL } from "./constants";

const httpLink = new HttpLink({ uri: GQL_HTTP_URL });

const link =
	typeof window === "undefined"
		? httpLink
		: split(
				({ query }) => {
					const definition = getMainDefinition(query);
					return (
						definition.kind === "OperationDefinition" &&
						definition.operation === "subscription"
					);
				},
				new GraphQLWsLink(createClient({ url: GQL_WS_URL })),
				httpLink,
			);

export const apolloClient = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});
