// hooks/usePackagesWithCsvFiles.ts
import { useInfiniteQuery } from "@tanstack/react-query";

const getPackagesWithCsvFiles = async (
  baseUrl: string,
  pageParam: number | null
): Promise<any> => {
  const pageSize = 100;
  const start = pageParam === null ? 0 : pageParam * pageSize;
  const url = `${baseUrl}/api/3/action/package_search?fq=res_format:CSV&rows=${pageSize}&start=${start}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.success) {
      return data.result;
    } else {
      throw new Error(data.error.message);
    }
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

export const usePackagesWithCsvFiles = (baseUrl: string) => {
  return useInfiniteQuery(
    ["packagesWithCsvFiles", baseUrl],
    ({ pageParam = null }) => getPackagesWithCsvFiles(baseUrl, pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.results.length < 100) {
          return undefined;
        }

        const nextPageParam = lastPage.start + 100;
        return nextPageParam;
      },
    }
  );
};
