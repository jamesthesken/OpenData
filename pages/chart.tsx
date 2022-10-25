import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import Layout from "./components/Layout";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";

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
  third: {
    path: "/chart",
    text: "Visualize",
  },
};

const Table: NextPage = () => {
  return (
    <div>
      <Layout>
        <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
            {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
            <div className="mt-2 md:flex md:items-center md:justify-between"></div>
          </header>
        </div>
      </Layout>
    </div>
  );
};

export default Table;
