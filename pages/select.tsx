import React, { useState, useEffect, useContext } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Layout from "./components/Layout";
import { DataContext } from "../hooks/useData";
import Link from "next/link";

interface item {
  title: string;
  resources: Array<{
    id: string;
    format: string;
  }>;
}

const Select: NextPage = () => {
  const [dataList, setDataList] = useState([]);

  const data = useContext(DataContext);

  console.log(data);

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
        <ul role="list" className="divide-y divide-gray-200 ">
          {dataList.map((item: item) => (
            <li key={item.title} className="py-4">
              {item.title}
              <p>{item.resources.filter((obj) => obj.format == "CSV")[0].id}</p>
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
      </Layout>
    </div>
  );
};

export default Select;
