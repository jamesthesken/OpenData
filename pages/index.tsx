import React, { useState, useEffect, useContext, createContext } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Layout from "./components/Layout";
import DataTable from "./components/DataTable";
import { table } from "console";
import { DataContext } from "../hooks/useData";

interface ColumnDetails {
  [key: string]: string;
  id: string;
}

interface Column {
  Header: string;
  accessor: string;
  cell: any;
}

const Home: NextPage = () => {
  const [apiData, setRowData] = useState<ColumnDetails[]>([]);
  const [cols, setColHeaders] = useState<ColumnDetails[]>([]);

  const value = useContext(DataContext);

  useEffect(() => {
    axios
      .get(
        "https://opendata.hawaii.gov/api/3/action/datastore_search?resource_id=caf4dc69-cf11-43dc-b4f9-3c29156d7630"
      )
      .then(function (response) {
        // TODO: catch errors and present to user
        // handle success
        console.log(response.data);
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

export default Home;
