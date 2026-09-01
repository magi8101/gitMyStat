import { QLError } from "./Error";

export interface PinnedRepo {
  name: string;
  description: string | null;
  url: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
}

export interface RawPinnedData {
  data: {
    user: {
      pinnedItems: {
        nodes: PinnedRepo[];
      };
    } | null;
  };
  errors?: QLError[];
}
