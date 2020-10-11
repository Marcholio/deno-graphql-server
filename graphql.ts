import { gql } from './deps.ts'

export const typeDefs = gql`
  type Test {
    name: String,
    description: String
  }

  type Query {
    getTest(name: String): Test
  }
`;

export const resolvers = {
  Query: {
    getTest: (parent: any, { name }: { name: string}) => {
      console.log(name);
      return { name, description: 'Description here'}
    }
  }
}
