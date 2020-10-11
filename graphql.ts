import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { gql, uuidV4 } from "./deps.ts";
import type { Item, List, ListWithItems } from "./types.ts";

// In-memory storage is sufficient for testing purposes
let items: Record<string, Omit<Item, "id">> = {};
let lists: Record<string, Omit<List, "id">> = {};

const populateStorage = () => {
  // Generate lists without items
  lists = [...new Array(3)].map((a, i) => uuidV4.generate())
    .reduce(
      (acc, cur, i) => ({
        ...acc,
        [cur]: {
          title: `Todo list #${i + 1}`,
          items: [],
        },
      }),
      {},
    );

  // Generate some items
  items = [...new Array(10)].map((a, i) => uuidV4.generate()).reduce(
    (acc, cur, i) => ({
      ...acc,
      [cur]: { title: `Task #${i + 1}`, done: Math.random() < 0.3 },
    }),
    {},
  );

  const listKeys = Object.keys(lists);

  // Randomly assign each item to some list
  Object.keys(items).forEach((itemId) =>
    lists[listKeys[Math.floor(Math.random() * listKeys.length)]].items.push(
      itemId,
    )
  );
};

export const typeDefs = gql`
  type Item {
    id: String
    title: String
    done: Boolean
  }

  type List {
    id: String
    title: String
    items: [Item]
  }

  input CreateItemInput {
    title: String!
    listId: String!
  }

  input CreateListInput {
    title: String!
  }

  type ResetResponse {
    status: String!
  }

  input ResetInput {
    _: Boolean
  }

  input ToggleItemInput {
    itemId: String!
  }

  type Query {
    getLists: [List!]!
  }

  type Mutation {
    createItem (input: CreateItemInput): Item
    createList (input: CreateListInput): List
    toggleItemDone (input: ToggleItemInput): Item
    reset (input: ResetInput): ResetResponse
  }
`;

export const resolvers = {
  Query: {
    getLists: () => {
      return Object.keys(lists).reduce(
        (acc: ListWithItems[], id) => {
          const listItems: Item[] = lists[id].items.map((itemId) => ({
            id: itemId,
            ...items[itemId],
          })).filter((i) => !!i.title);

          if (listItems.length !== lists[id].items.length) {
            throw new GQLError("Inconsistent server state");
          }

          return acc.concat(
            {
              id,
              ...lists[id],
              items: listItems,
            } as ListWithItems,
          );
        },
        [],
      );
    },
  },

  Mutation: {
    createItem: (
      parent: any,
      { input }: { input: { title: string; listId: string } },
    ) => {
      if (!input.title || !input.listId) {
        throw new GQLError("Invalid item payload");
      } else if (!lists[input.listId]) {
        throw new GQLError("Unknown list");
      }

      const item: Item = {
        id: uuidV4.generate(),
        title: input.title,
        done: false,
      };

      items[item.id] = item;
      lists[input.listId].items.push(item.id);

      return item;
    },

    createList: (
      parent: any,
      { input }: { input: { title: string } },
    ) => {
      if (!input.title) {
        throw new GQLError("Title not defined");
      }

      const list = { id: uuidV4.generate(), title: input.title };

      lists[list.id] = { title: list.title, items: [] };

      return list;
    },

    toggleItemDone: (parent: any, { input }: { input: { itemId: string } }) => {
      const item = items[input.itemId];
      if (!item) {
        throw new GQLError("Item not found");
      }
      const newItem = { ...item, done: !item.done };

      items[input.itemId] = newItem;

      return { id: input.itemId, ...newItem };
    },

    reset: () => {
      populateStorage();
      return { status: "OK" };
    },
  },
};
