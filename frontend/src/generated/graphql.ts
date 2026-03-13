import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Event = {
  __typename: 'Event';
  averageRating: Maybe<Scalars['Float']['output']>;
  feedback: Array<Feedback>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  reviewCount: Scalars['Int']['output'];
};

export type Feedback = {
  __typename: 'Feedback';
  description: Scalars['String']['output'];
  eventId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  userName: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  addFeedback: Feedback;
};


export type MutationAddFeedbackArgs = {
  description: Scalars['String']['input'];
  eventId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
  userName: Scalars['String']['input'];
};

export type Query = {
  __typename: 'Query';
  event: Maybe<Event>;
  events: Array<Event>;
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};

export type Subscription = {
  __typename: 'Subscription';
  feedbackAdded: Feedback;
};


export type SubscriptionFeedbackAddedArgs = {
  eventId: Scalars['ID']['input'];
};

export type GetEventsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEventsQuery = { events: Array<{ __typename: 'Event', id: string, name: string, averageRating: number | null, reviewCount: number }> };

export type GetEventQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetEventQuery = { event: { __typename: 'Event', id: string, name: string, feedback: Array<{ __typename: 'Feedback', id: string, userName: string, rating: number, description: string }> } | null };

export type AddFeedbackMutationVariables = Exact<{
  eventId: Scalars['ID']['input'];
  userName: Scalars['String']['input'];
  rating: Scalars['Int']['input'];
  description: Scalars['String']['input'];
}>;


export type AddFeedbackMutation = { addFeedback: { __typename: 'Feedback', id: string, eventId: string, userName: string, rating: number, description: string } };

export type FeedbackAddedSubscriptionVariables = Exact<{
  eventId: Scalars['ID']['input'];
}>;


export type FeedbackAddedSubscription = { feedbackAdded: { __typename: 'Feedback', id: string, userName: string, rating: number, description: string } };


export const GetEventsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvents"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"events"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"averageRating"}},{"kind":"Field","name":{"kind":"Name","value":"reviewCount"}}]}}]}}]} as unknown as DocumentNode<GetEventsQuery, GetEventsQueryVariables>;
export const GetEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"event"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"feedback"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]}}]} as unknown as DocumentNode<GetEventQuery, GetEventQueryVariables>;
export const AddFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userName"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"rating"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFeedback"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userName"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userName"}}},{"kind":"Argument","name":{"kind":"Name","value":"rating"},"value":{"kind":"Variable","name":{"kind":"Name","value":"rating"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eventId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<AddFeedbackMutation, AddFeedbackMutationVariables>;
export const FeedbackAddedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"FeedbackAdded"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"feedbackAdded"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"eventId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eventId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"rating"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<FeedbackAddedSubscription, FeedbackAddedSubscriptionVariables>;