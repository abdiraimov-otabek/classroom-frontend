import { BACKEND_BASE_URL } from "@/contstants";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import { ListResponse } from "../types/index.ts";

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };

