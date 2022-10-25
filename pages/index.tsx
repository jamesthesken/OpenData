import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Layout from "./components/Layout";
import BreadCrumbs from "./components/dashboard/BreadCrumbs";
import Link from "next/link";

interface item {
  title: string;
  resources: Array<{
    id: string;
    format: string;
  }>;
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
};

const Home: NextPage = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://opendata.hawaii.gov/api/3/action/current_package_list_with_resources"
      )
      .then(function (response) {
        // TODO: catch errors and present to user
        // handle success
        console.log(response.data);
        setDataList(response.data.result);
      });
  }, []);

  return (
    <div>
      <Layout>
        <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
            {breadCrumbs && <BreadCrumbs breadCrumbs={breadCrumbs} />}
            <div className="mt-2 md:flex md:items-center md:justify-between"></div>
          </header>
          <ul role="list" className="divide-y divide-gray-200 ">
            {dataList.map((item: item) => (
              <li key={item.title} className="py-4">
                {item.title}
                <p>
                  {item.resources.filter((obj) => obj.format == "CSV")[0].id}
                </p>
                <Link
                  href={{
                    pathname: "/table",
                    query: {
                      id: item.resources.filter((obj) => obj.format == "CSV")[0]
                        .id,
                    },
                  }}
                >
                  <a>path</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Layout>
    </div>
  );
};

export default Home;
