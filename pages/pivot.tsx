import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "./components/Layout";
import { NextPage } from "next";
import "react-pivottable/pivottable.css";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import dynamic from "next/dynamic";
import axios from "axios";
import { useAllDatastoreRecords } from "../hooks/useDataStore";
import { PlotParams } from "react-plotly.js";
import { Dataset } from ".";

// create Plotly renderers via dependency injection
const PlotlyRenderers = createPlotlyRenderers(Plot);
import {
  PivotTableUI,
  createPlotlyRenderers,
  TableRenderers,
} from "@imc-trading/react-pivottable";

import "@imc-trading/react-pivottable/pivottable.css";
import { useRouter } from "next/router";
import InfoAlert from "./components/Info";

// to remove weird characters from the notes
const regex = /(<([^>]+)>)/gi;

const breadCrumbs = {
  back: {
    path: "/",
    text: "Back",
  },
  first: {
    path: "/",
    text: "Home",
  },
  second: {
    path: "/pivot",
    text: "Table",
  },
};

const Pivot: NextPage = () => {
  const [state, setState] = useState({});
  const router = useRouter();

  const fetchDataSet = () =>
    fetch(
      `https://opendata.hawaii.gov/api/3/action/package_search?fq=id:${router.query.dataSetId}`
    )
      .then((res) => res.json())
      .then((data) => data.result.results[0] as Dataset); // Cast to Dataset type

  const {
    error,
    data: dataSetInfo,
    isFetching,
    isPreviousData,
    refetch,
  } = useQuery({
    queryKey: [router.query.id],
    queryFn: fetchDataSet,
    keepPreviousData: true,
  });

  const { data, isLoading, isError } = useAllDatastoreRecords(
    router.query.id as string
  );

  console.log(dataSetInfo);

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
          <div className="mt-2 md:flex md:items-center md:justify-between"></div>
        </header>
        {dataSetInfo && (
          <div className="flex md:flex-col justify-start mb-20">
            <h3 className="text-2xl">{dataSetInfo?.title}</h3>
            <p className="mt-4"> {dataSetInfo?.notes.replace(regex, "")}</p>
            <div className="mt-4 md:flex-row">
              {dataSetInfo.tags.map((tag) => (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 mr-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="my-20">
          <InfoAlert info="We are working to support multiple dataset resources (e.g., maps), however for now, only CSV dataset exploration is supported." />
        </div>
        {isLoading ? <div>Loading...</div> : isError && <div>Error</div>}
        {data && (
          <div className="flex md:flex-row justify-start">
            <PivotTableUI
              data={data}
              onChange={(s: any) => setState(s)}
              renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
              {...state}
              className="px-96"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Pivot;
