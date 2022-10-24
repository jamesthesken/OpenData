import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import axios from "axios";
import Layout from "./components/Layout";

interface item {
  title: string;
  resources: Array<{
    id: string;
    format: string;
  }>;
}

function selectData(dataList: any) {
  var csvId = dataList.filter((obj: item) => {
    return obj.resources.format == "CSV";
  });
  console.log(csvId);
}

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
        <ul role="list" className="divide-y divide-gray-200 ">
          {dataList.map((item: item) => (
            <li key={item.title} className="py-4">
              {item.title}
              <button onClick={(item) => console.log(item)}>test</button>
            </li>
          ))}
        </ul>
      </Layout>
    </div>
  );
};

export default Home;
