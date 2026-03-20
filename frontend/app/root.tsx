import { Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation, useRouteError } from "react-router";
import "../src/index.css";
import { ApolloProvider } from "@apollo/client/react";
import { Spinner } from "../src/components/Spinner";
import { ErrorDisplay } from "../src/components/ErrorDisplay";
import { apolloClient } from "../src/lib/apollo-client";

export function ErrorBoundary() {
	const error = useRouteError();
	return (
		<div className="mx-auto max-w-2xl px-4 py-8">
			<ErrorDisplay error={error} />
		</div>
	);
}

export function HydrateFallback() {
	return (
		<div className="mx-auto max-w-2xl px-4 py-8">
			<div className="flex justify-center mt-8">
				<Spinner className="h-8 w-8 text-muted-foreground" />
			</div>
		</div>
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function Root() {
	const navigation = useNavigation();
	return (
		<ApolloProvider client={apolloClient}>
			<div className="mx-auto max-w-2xl px-4 py-8">
				{navigation.state === "loading" ? (
					<div className="flex justify-center mt-8">
						<Spinner className="h-8 w-8 text-muted-foreground" />
					</div>
				) : (
					<Outlet />
				)}
			</div>
		</ApolloProvider>
	);
}
