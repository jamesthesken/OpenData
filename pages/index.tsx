import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Layout from "./components/Layout";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";
import Link from "next/link";
import { usePackagesWithCsvFiles } from "../hooks/useCsvPackages";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface item {
  title: string;
  id: string;
  resources: Array<{
    id: string;
    format: string;
  }>;
}

export type Dataset = {
  creator_user_id: string;
  id: string;
  name: string;
  notes: string;
  num_resources: number;
  title: string;
  url: string;
  state: string;
  metadata_created: string;
  metadata_moidified: string;
  tags: {
    state: string;
    display_name: string;
    name: string;
    id: string;
  }[];
  resources: {
    id: string;
    created: string;
    format: string;
    url: string;
    name: string;
  }[];
};

const breadCrumbs = {
  back: {
    path: "/",
    text: "Back",
  },
  first: {
    path: "/",
    text: "Dashboard",
  },
};

// to remove weird characters from the notes
const regex = /(<([^>]+)>)/gi;

const Home: NextPage = () => {
  const [dataList, setDataList] = useState([]);

  const [page, setPage] = useState(0);
  const [value, setValue] = useState("");

  const fetchCsvResources = (page = 0) =>
    fetch(
      `https://opendata.hawaii.gov/api/3/action/package_search?fq=res_format:CSV&rows=20&start=${page}`
    ).then((res) => res.json());

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery({
      queryKey: ["csvData", page],
      queryFn: () => fetchCsvResources(page),
      keepPreviousData: true,
    });

  console.log(data);

  return (
    <div>
      <Layout>
        <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
            {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
            <div className="mt-2 md:flex md:items-center md:justify-between"></div>
          </header>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                name="search"
                className="block w-full rounded-md border-0 bg-gray-100 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                placeholder="Search"
                type="search"
                onChange={(val) => setValue(val.target.value)}
              />
            </div>
          </div>
          <div>
            {isFetching ? <span> Loading...</span> : null}{" "}
            {isLoading ? (
              <div>Loading...</div>
            ) : isError ? (
              <div>Error</div>
            ) : (
              <div>
                {data?.result.results.map((dataset: Dataset) => (
                  <div key={dataset.id} className="mt-10">
                    <Link
                      href={{
                        pathname: "/table",
                        query: {
                          id: dataset.resources.filter(
                            (obj: any) => obj.format == "CSV"
                          )[0].id,
                        },
                      }}
                    >
                      <a className="hover:underline font-semibold text-xl text-gray-800">
                        {dataset.title}
                      </a>
                    </Link>
                    <p className="truncate text-ellipsis ...">
                      {dataset.notes.replace(regex, "")}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <nav
              className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-10 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  {page === 0 ? (
                    <span className="font-medium">1</span>
                  ) : (
                    <span className="font-medium">{page}</span>
                  )}{" "}
                  to{" "}
                  <span className="font-medium">
                    {page + data?.result.results.length}
                  </span>{" "}
                  of <span className="font-medium">{data?.result.count}</span>{" "}
                  datasets
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 mr-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setPage((old) => Math.max(old - 20, 0))}
                  disabled={page === 0}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                  Previous
                </button>
                <button
                  className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                  onClick={() => {
                    setPage((old) => old + 20);
                  }}
                  disabled={isPreviousData || page >= data?.result.count}
                >
                  Next
                </button>
                <button
                  onClick={() => setPage(data?.result.count - 8)}
                  disabled={page === data?.result.count - 8}
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 ml-3 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
