import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import '../src/index.css'
import { ApolloProvider } from '@apollo/client/react'

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' })

const link = typeof window === 'undefined'
  ? httpLink
  : split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      new GraphQLWsLink(createClient({ url: 'ws://localhost:4001/' })),
      httpLink,
    )

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})

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
  )
}

export default function Root() {
  return (
    <ApolloProvider client={client}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Outlet />
      </div>
    </ApolloProvider>
  )
}
