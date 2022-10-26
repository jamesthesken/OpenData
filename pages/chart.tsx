import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import Layout from "./components/Layout";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";
import Dropdown from "./components/Dropdown";
import { DataContext } from "../hooks/useData";
import { LineChartForm } from "./components/controls/LineChartForm";

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
    path: "/table",
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
  const value = useContext(DataContext);
  const [chartData, setChartData] = useState(
    Array<{
      id: string | number;
      data: Array<{
        x: number | string | Date;
        y: number | string | Date;
      }>;
    }>
  );
  console.log(chartData);

  return (
    <div>
      <Layout>
        <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
            {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
            <div className="mt-2 md:flex md:items-center md:justify-between"></div>
          </header>
          <main className="pb-8">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <h1 className="sr-only">Page title</h1>
              {/* Main 3 column grid */}
              <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
                {/* Left column */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-1">
                  <section aria-labelledby="section-1-title">
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="p-6">
                        <h2 className="block text-xl font-medium text-gray-700 mb-5">
                          Horizontal Axis
                        </h2>
                        <Dropdown column={value.data.columns} />
                      </div>
                      <div className="p-6">
                        <h2 className="block text-xl font-medium text-gray-700 mb-5">
                          Vertical Axis
                        </h2>
                        <Dropdown column={value.data.columns} />
                      </div>
                      <div className="p-6">
                        <LineChartForm setChartData={setChartData} />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Right column */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                  <section aria-labelledby="section-2-title">
                    <h2 className="sr-only" id="section-2-title">
                      Section title
                    </h2>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="p-6"></div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </div>
  );
};

export default Table;
