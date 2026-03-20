import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";

export function createClient() {
	return new ApolloClient({
		link: new HttpLink({ uri: "http://localhost:4000/" }),
		cache: new InMemoryCache(),
	});
}
