import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { DataContext } from "../../../hooks/useData";

interface Values {
  firstName: string;
  lastName: string;
  email: string;
}

interface Props {
  setChartData: Dispatch<SetStateAction<ChartData>>;
}

export function LineChartForm({ setChartData }: Props) {
  const value = useContext(DataContext);

  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
        }}
        onSubmit={(
          values: Values,
          { setSubmitting }: FormikHelpers<Values>
        ) => {
          setTimeout(() => {
            // alert(JSON.stringify(values, null, 2));
            var chartData = mapToChart(
              value?.data.data,
              "BRANDNAME",
              "FULLNAME",
              "LICENSEDTTM"
            );
            setChartData(chartData);
            setSubmitting(false);
          }, 500);
        }}
      >
        <Form>
          <label htmlFor="firstName">First Name</label>
          <Field
            // onChange={() => setColumns(["test"])}
            id="firstName"
            name="firstName"
            placeholder="John"
          />

          <label htmlFor="lastName">Last Name</label>
          <Field id="lastName" name="lastName" placeholder="Doe" />

          <label htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            placeholder="john@acme.com"
            type="email"
          />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}

function mapToChart(
  value: ColumnDetails[],
  key: string,
  xAxis: string,
  yAxis: string
): ChartData {
  var arr: ChartData = [
    {
      id: key,
      data: value
        .map((row) => ({
          x: row[xAxis],
          y: row[yAxis],
        }))
        .filter((o) => o.y != null || o.x != null),
    },
  ];
  console.log(arr);
  return arr;
}
