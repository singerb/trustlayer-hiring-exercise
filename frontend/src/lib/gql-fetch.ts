import type { OperationVariables, TypedDocumentNode } from "@apollo/client";
import { apolloClient } from "./apollo-client";

export async function gqlFetch<TData, TVars extends OperationVariables>(
	document: TypedDocumentNode<TData, TVars>,
	variables: TVars,
): Promise<TData | undefined> {
	const result = await apolloClient.query<TData, TVars>({
		query: document,
		variables: variables,
	});
	return result.data;
}

export async function gqlSimpleFetch<TData, TVars extends OperationVariables>(
	document: TypedDocumentNode<TData, TVars>,
): Promise<TData | undefined> {
	const result = await apolloClient.query<TData>({
		query: document,
	});
	return result.data;
}
