import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import axios from "axios";
import Layout from "./components/Layout";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";
import Link from "next/link";
import { usePackagesWithCsvFiles } from "../hooks/useCsvPackages";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import screenshot from "../public/demo_screenshot.png";

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
  metadata_modified: string;
  organization: {
    id: string;
    approval_status: string;
    name: string;
    title: string;
  };
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
    text: "Home",
  },
};

// Hook
function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

// to remove weird characters from the notes
const regex = /(<([^>]+)>)/gi;

const Home: NextPage = () => {
  const [dataList, setDataList] = useState([]);

  const [page, setPage] = useState(0);
  const [value, setValue] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => {
    setValue(data.search);
    refetch();
  };

  const fetchCsvResources = (page = 0) =>
    fetch(
      `https://opendata.hawaii.gov/api/3/action/package_search?q=${value}&fq=res_format:CSV&rows=20&start=${page}`
    ).then((res) => res.json());

  const {
    isLoading,
    isError,
    error,
    data,
    isFetching,
    isPreviousData,
    refetch,
  } = useQuery({
    queryKey: ["csvData", page, value],
    queryFn: () => fetchCsvResources(page),
    keepPreviousData: true,
  });

  return (
    <div>
      <Layout>
        <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative isolate pt-14">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div className="py-24 sm:py-32 lg:pb-40">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Explore data from OpenData Hawaii
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600">
                    Dive into government datasets related to education,
                    healthcare, environment, tourism, and much more. Whether you
                    are a researcher, student, or data enthusiast, explore and
                    visualize data that matters to you.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                      href="#datasets"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </a>
                    <a
                      href="#"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
                <div className="mt-16 flow-root sm:mt-24">
                  <div className="-m-2 rounded-xl lg:p-4">
                    <Image
                      src={screenshot}
                      alt="App screenshot"
                      width={2432}
                      height={1442}
                      className="rounded-lg shadow-2xl ring-1 ring-gray-900/10"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
          <div id="datasets" className="w-full sm:max-w-xs">
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  id="search"
                  className="block w-full rounded-md border-0 bg-gray-100 py-1.5 pl-10 pr-3 text-gray-600 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                  placeholder="Search"
                  type="search"
                  {...register("search")}
                />
              </form>
            </div>
          </div>
          <h1 className="mt-5 text-3xl text-gray-800 font-semibold">
            {data?.result.count} Datasets found
          </h1>
          <div>
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
                        pathname: "/pivot",
                        query: {
                          dataSetId: dataset.id,
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
