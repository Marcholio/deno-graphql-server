export type Item = {
  id: string;
  title: string;
  done: boolean;
};

export type List = {
  id: string;
  title: string;
  items: string[];
};

export type ListWithItems = List & {
  items: Item[];
};
