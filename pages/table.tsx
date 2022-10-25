import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Layout from "./components/Layout";
import DataTable from "./components/DataTable";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";
import { DataContext } from "../hooks/useData";
import { useRouter } from "next/router";
import Link from "next/link";

interface ColumnDetails {
  [key: string]: string;
  id: string;
}

interface Column {
  Header: string;
  accessor: string;
  cell: any;
}

const breadCrumbs = {
  back: {
    path: "/",
    text: "Back",
  },
  first: {
    path: "/",
    text: "Dashboard",
  },
  second: {
    path: "/table",
    text: "Table",
  },
};

const Table: NextPage = () => {
  const [apiData, setRowData] = useState<ColumnDetails[]>([]);
  const [cols, setColHeaders] = useState<ColumnDetails[]>([]);

  const value = useContext(DataContext);
  const router = useRouter();

  useEffect(() => {
    if (router.query.id != null) {
      axios
        .get(
          `https://opendata.hawaii.gov/api/3/action/datastore_search?resource_id=${router.query.id}`
        )
        .then(function (response) {
          // TODO: catch errors and present to user
          // handle success
          setRowData(response.data.result.records);
          setColHeaders(response.data.result.fields);
          // Update global state holding the tabulated data
          value?.updateData(
            response.data.result.records,
            response.data.result.fields
          );
        });
    } else {
      setRowData(value?.data.data as ColumnDetails[]);
      setColHeaders(value?.data.columns as ColumnDetails[]);
    }
  }, []);

  const data = React.useMemo<ColumnDetails[]>(() => apiData, [apiData]);
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
        <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
            {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
            <div className="mt-2 md:flex md:items-center md:justify-between"></div>
          </header>
          <DataTable data={data} columns={columns} />
          <Link
            href={{
              pathname: "/chart",
            }}
          >
            <a>path</a>
          </Link>
        </div>
      </Layout>
    </div>
  );
};

export default Table;
