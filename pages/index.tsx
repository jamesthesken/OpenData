import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Table from "./components/Table";
import Layout from "./components/Layout";
import DataTable from "./components/DataTable";

interface ColumnDetails {
  [key: string]: string;
  id: string;
}

interface Column {
  Header: string;
  accessor: string;
}

const Home: NextPage = () => {
  const [apiData, setRowData] = useState<ColumnDetails[]>([]);
  const [cols, setColHeaders] = useState<ColumnDetails[]>([]);

  useEffect(() => {
    axios
      .get(
        "https://opendata.hawaii.gov/api/3/action/datastore_search?resource_id=caf4dc69-cf11-43dc-b4f9-3c29156d7630"
      )
      .then(function (response) {
        // TODO: catch errors and present to user
        // handle success
        setRowData(response.data.result.records);
        setColHeaders(response.data.result.fields);
      });
  }, []);

  const data = React.useMemo<ColumnDetails[]>(() => apiData, [apiData]);

  const columns = React.useMemo<Column[]>(
    () => cols.map((col) => ({ Header: col.id, accessor: col.id })),
    [cols]
  );

  return (
    <div>
      <Layout>
        {/* <Table /> */}
        <DataTable data={data} columns={columns} />
      </Layout>
    </div>
  );
};

export default Home;
