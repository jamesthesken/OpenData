import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import Layout from "./components/Layout";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";
import { Tab } from "@headlessui/react";
import { DataContext } from "../hooks/useData";
import { LineChartForm } from "./components/controls/LineChartForm";
import ResponsiveScatter from "./components/ScatterPlot";
import scatterplot from "../public/scatterplot-light-colored.png";
import barchart from "../public/bar-light-colored.png";
import Image from "next/image";
import { BarChartForm } from "./components/controls/BarChartForm";
import BarChart from "./components/BarChart";

interface ColumnDetails {
  [key: string]: string;
  id: string;
}

interface Column {
  Header: string;
  accessor: string;
  cell: any;
}

const tabs = [
  { name: "Chart Type", current: false },
  { name: "Select Data", current: true },
  { name: "Refine", current: false },
];

const chartType = [
  {
    title: "Scatter Plot",
    source: scatterplot,
    index: 0,
  },
  {
    title: "Bar Chart",
    source: barchart,
    index: 1,
  },
];

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

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const Table: NextPage = () => {
  const [activeChartType, setActiveChartType] = useState(0);
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
  // TODO: find a better way to initialize an empty bar chart
  const emptyObj = {};
  const [barChart, setBarChartData] = useState([emptyObj]);
  const [barChartIndex, setBarChartIndex] = useState("");
  const [barChartKeys, setBarChartKeys] = useState([""]);

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
                  <div className="w-full max-w-md px-2 sm:px-0">
                    <Tab.Group>
                      <Tab.List
                        className="-mb-px flex space-x-8"
                        aria-label="Tabs"
                      >
                        {tabs.map((category) => (
                          <Tab
                            key={category.name}
                            className={({ selected }) =>
                              classNames(
                                selected
                                  ? "border-indigo-500 text-indigo-600"
                                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                              )
                            }
                          >
                            {category.name}
                          </Tab>
                        ))}
                      </Tab.List>
                      <Tab.Panels className="mt-2">
                        <Tab.Panel>
                          <div className="overflow-hidden rounded-lg bg-white shadow">
                            <div className="p-6">
                              <ul
                                role="list"
                                className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
                              >
                                {chartType.map((file) => (
                                  <li className="relative">
                                    <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg  focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                      <Image
                                        src={file.source}
                                        alt=""
                                        className="pointer-events-none object-cover group-hover:opacity-75"
                                      />
                                      <button
                                        type="button"
                                        className="absolute inset-0 focus:outline-none"
                                        onClick={() =>
                                          setActiveChartType(file.index)
                                        }
                                      ></button>
                                    </div>
                                    <p className="pointer-events-none block text-sm font-medium text-gray-900">
                                      {file.title}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </Tab.Panel>
                        <Tab.Panel>
                          <section aria-labelledby="section-1-title">
                            <div className="overflow-hidden rounded-lg bg-white shadow">
                              <div className="p-6">
                                {activeChartType == 0 ? (
                                  <LineChartForm setChartData={setChartData} />
                                ) : (
                                  <></>
                                )}
                                {activeChartType == 1 ? (
                                  <BarChartForm
                                    setChartData={setBarChartData}
                                    setBarChartIndex={setBarChartIndex}
                                    setBarChartKeys={setBarChartKeys}
                                  />
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </section>
                        </Tab.Panel>
                      </Tab.Panels>
                    </Tab.Group>
                  </div>
                </div>

                {/* Right column */}
                <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                  <section aria-labelledby="section-2-title">
                    <h2 className="sr-only" id="section-2-title">
                      Section title
                    </h2>
                    <div className="overflow-hidden rounded-lg bg-white shadow">
                      <div className="p-6 w-full h-96">
                        {activeChartType == 0 ? (
                          <ResponsiveScatter chartData={chartData} />
                        ) : (
                          <></>
                        )}
                        {activeChartType == 1 ? (
                          <BarChart
                            chartData={barChart}
                            keys={barChartKeys}
                            indexBy={barChartIndex}
                          />
                        ) : (
                          <></>
                        )}
                      </div>
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
