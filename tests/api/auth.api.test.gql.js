import gql from "graphql-tag";

export const AUTH_USER_QUERY = gql`
  query {
    getCurrentUser {
      id
      name
      email
      role
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup($name: String!, $email: String!, $password: String!) {
    signUp(name: $name, email: $email, password: $password) {
      token
      user {
        name
        email
        role
      }
    }
  }
`;
