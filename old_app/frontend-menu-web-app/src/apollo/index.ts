//@ts-nocheck

import {ApolloClient, HttpLink, InMemoryCache, createHttpLink, split} from '@apollo/client'

import { WebSocketLink } from '@apollo/client/link/ws';
import { createUploadLink } from "apollo-upload-client";
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
// const apiUrl = '192.168.184.1:8081'
const apiUrl = 'terra.menu'
// const apiUrl =  process.env.NODE_ENV === 'production' ? process.env.REACT_APP_SERVER_PROD : process.env.REACT_APP_SERVER_DEV;
const wsLink = new WebSocketLink({
  uri: `wss://${apiUrl}/subscriptions`,
   // uri: `ws://${apiUrl}/subscriptions`,

    options: {
    reconnect: true,
    timeout: 30000
  }
});
const httpLink = createHttpLink({
  uri: `https://${apiUrl}/api/graphql`,
    // uri: `http://${apiUrl}/api/graphql`,

});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('Terracy_user_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
export const client = new ApolloClient({
    link: authLink.concat(splitLink),
    cache: new InMemoryCache()
})