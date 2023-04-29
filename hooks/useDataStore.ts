import { useQuery } from "@tanstack/react-query";

interface DatastoreRecord {
  [key: string]: any;
}

interface DatastoreResponse {
  records: DatastoreRecord[];
  total: number;
}

const BASE_URL = "https://opendata.hawaii.gov";
const RESOURCE_ID = "ff2c65a5-bec2-426c-bb13-ce08bfc64863";
const LIMIT = 1000;

async function fetchAllDatastoreRecords(
  page = 0,
  resourceId: string
): Promise<DatastoreResponse> {
  const offset = page * LIMIT;
  const url = `${BASE_URL}/api/3/action/datastore_search?resource_id=${resourceId}&limit=${LIMIT}&offset=${offset}`;
  const response = await fetch(url);
  const json = await response.json();
  const records = json.result.records as DatastoreRecord[];
  const total = json.result.total as number;
  return { records, total };
}

export function useAllDatastoreRecords(resourceId: string) {
  return useQuery([`allDatastoreRecords_${resourceId}`], async () => {
    let page = 0;
    let result: DatastoreRecord[] = [];
    let total = 0;
    do {
      const response = await fetchAllDatastoreRecords(page, resourceId);
      result = result.concat(response.records);
      total = response.total;
      page += 1;
    } while (result.length < total);
    return result;
  });
}
