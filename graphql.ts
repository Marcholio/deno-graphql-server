import { GQLError } from "https://deno.land/x/oak_graphql@0.6.2/mod.ts";
import { gql, uuidV4 } from "./deps.ts";
import type { Item, List, ListWithItems } from "./types.ts";

const items: Record<string, Omit<Item, "id">> = {};

const lists: Record<string, Omit<List, "id">> = {
  [uuidV4.generate()]: { title: "Todo list #1", items: [] },
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
  },
};
