import React, { useState, useEffect, useCallback, useRef } from "react";
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
import Map, {
  Source,
  Layer,
  Popup,
  MapLayerMouseEvent,
  MapRef,
} from "react-map-gl";
import { FeatureCollection, Feature as GeoJSONFeature } from "geojson";
import "mapbox-gl/dist/mapbox-gl.css";

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
import DataDetails from "./components/DataDetails";

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
  const [hoverInfo, setHoverInfo] = useState(null);
  const [mapData, setMapData] = useState();
  const mapRef = useRef<MapRef>(null);

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const [selectedFeature, setSelectedFeature] = useState<GeoJSONFeature | null>(
    null
  );

  const onShapeClick = useCallback((event: MapLayerMouseEvent) => {
    const { point } = event;
    const map = mapRef.current;
    console.log("hi");

    if (!map) return;

    const features = map.queryRenderedFeatures(point, { layers: ["route"] });
    const feature: GeoJSONFeature | undefined = features[0];
    console.log(features);

    if (feature) {
      setSelectedFeature(feature);
    } else {
      setSelectedFeature(null);
    }
  }, []);

  const onHover = useCallback((event: any) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  console.log(mapData);

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

  useEffect(() => {
    const url = dataSetInfo?.resources.filter(
      (resource) => resource.format === "GeoJSON"
    )[0]?.url;
    console.log(url);
    if (url) {
      fetch(url)
        .then((res) => res.json())
        .then((res) => setMapData(res));
    }
  }, [dataSetInfo]);

  console.log(dataSetInfo);

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
          <div className="mt-2 md:flex md:items-center md:justify-between"></div>
        </header>
        {dataSetInfo && <DataDetails dataset={dataSetInfo} />}
        <div className="h-full w-full align-center">
          {mapData && (
            <Map
              initialViewState={{
                longitude: -157,
                latitude: 21,
                zoom: 5,
              }}
              ref={mapRef}
              style={{ width: 600, height: 400 }}
              mapStyle="mapbox://styles/mapbox/streets-v9"
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
              interactiveLayerIds={["data"]}
              onClick={onShapeClick}
            >
              <Source id="route" type="geojson" data={mapData}>
                <Layer
                  id="route"
                  type="fill"
                  source="route"
                  paint={{
                    "fill-color": "#15803d",
                    "fill-opacity": 0.5,
                  }}
                />
                <Layer
                  id="route-line"
                  type="line"
                  source="route"
                  layout={{
                    "line-join": "round",
                    "line-cap": "round",
                  }}
                  paint={{
                    "line-color": "#15803d",
                    "line-width": 2,
                  }}
                />
              </Source>

              {selectedFeature && (
                <Popup
                  latitude={
                    selectedFeature.geometry.type === "Point"
                      ? (selectedFeature.geometry as GeoJSON.Point)
                          .coordinates[1]
                      : (selectedFeature.geometry as GeoJSON.Polygon)
                          .coordinates[0][0][1]
                  }
                  longitude={
                    selectedFeature.geometry.type === "Point"
                      ? (selectedFeature.geometry as GeoJSON.Point)
                          .coordinates[0]
                      : (selectedFeature.geometry as GeoJSON.Polygon)
                          .coordinates[0][0][0]
                  }
                  closeButton={true}
                  closeOnClick={false}
                  onClose={() => setSelectedFeature(null)}
                  anchor="top"
                >
                  <div className="bg-white text-black p-4 rounded shadow-md">
                    {selectedFeature.properties &&
                      Object.entries(selectedFeature.properties).map(
                        ([key, value]) => (
                          <p key={key}>
                            {key}: {value}
                          </p>
                        )
                      )}
                  </div>
                </Popup>
              )}
            </Map>
          )}
        </div>
        {isLoading ? (
          <div
            role="status"
            className="flex flex-row align-middle items-center mt-20"
          >
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading datasets...</span>
            <p className="text-gray-600">Loading datasets...</p>
          </div>
        ) : (
          isError && <div>Error</div>
        )}
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
