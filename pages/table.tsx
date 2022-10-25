import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Layout from "./components/Layout";
import DataTable from "./components/DataTable";
import { DataContext } from "../hooks/useData";
import { useRouter } from "next/router";

interface ColumnDetails {
  [key: string]: string;
  id: string;
}

interface Column {
  Header: string;
  accessor: string;
  cell: any;
}

const Table: NextPage = () => {
  const [apiData, setRowData] = useState<ColumnDetails[]>([]);
  const [cols, setColHeaders] = useState<ColumnDetails[]>([]);

  const value = useContext(DataContext);

  const router = useRouter();

  console.log("Query: ", router.query);

  useEffect(() => {
    axios
      .get(
        `https://opendata.hawaii.gov/api/3/action/datastore_search?resource_id=${router.query.id}`
      )
      .then(function (response) {
        // TODO: catch errors and present to user
        // handle success
        setRowData(response.data.result.records);
        setColHeaders(response.data.result.fields);
      });
  }, []);

  const data = React.useMemo<ColumnDetails[]>(() => apiData, [apiData]);

  // value?.updateData(data);

  const columns = React.useMemo<Column[]>(
    () =>
      cols.map((col) => ({
        Header: col.id,
        accessor: col.id,
        cell: (info: any) => info.getValue(),
      })),
    [cols]
  );

  return (
    <div>
      <Layout>
        <DataTable data={data} columns={columns} />
        <button
          onClick={() => {
            value?.updateData(data);
          }}
        >
          Update state
        </button>
      </Layout>
    </div>
  );
};

export default Table;
