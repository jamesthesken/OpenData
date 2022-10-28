import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Formik, Field, Form, FormikHelpers } from "formik";
import { DataContext } from "../../../hooks/useData";
import { stringify } from "querystring";
import { values } from "lodash";

interface FormValues {
  idx: string;
  keys: string;
}

interface Props {
  setChartData: Dispatch<SetStateAction<BarChart[]>>;
  setBarChartIndex: Dispatch<SetStateAction<string>>;
  setBarChartKeys: Dispatch<SetStateAction<string[]>>;
}

export function BarChartForm({
  setChartData,
  setBarChartIndex,
  setBarChartKeys,
}: Props) {
  const value = useContext(DataContext);

  return (
    <div>
      <Formik
        initialValues={{
          idx: "",
          keys: "",
        }}
        onSubmit={(
          formValues: FormValues,
          { setSubmitting }: FormikHelpers<FormValues>
        ) => {
          setTimeout(() => {
            var arr: Array<Record<string, string>> = [];
            groupByToMap(value.data.data, (k) => k[formValues.idx]).forEach(
              (value: ColumnDetails[], key: string) => {
                arr.push(
                  mapToChart(value, key, formValues.keys, formValues.idx)
                );
              }
            );
            setBarChartIndex(formValues.idx);
            setBarChartKeys([formValues.keys]);
            setChartData(arr);
            setSubmitting(false);
          }, 500);
        }}
      >
        <Form>
          <h2 className="block text-xl font-medium text-gray-700 mb-5">
            Index By
          </h2>
          <label
            htmlFor="idx"
            className="block text-sm font-medium text-gray-700"
          >
            Select Column
          </label>
          <Field
            as="select"
            id="idx"
            name="idx"
            className="mt-1 mb-6 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {value?.data.columns.map((column) => {
              return <option value={column.id}>{column.id}</option>;
            })}
          </Field>
          <h2 className="block text-xl font-medium text-gray-700 mb-5">Keys</h2>
          <label
            htmlFor="keys"
            className="block text-sm font-medium text-gray-700"
          >
            Select Column
          </label>
          <Field
            as="select"
            id="keys"
            name="keys"
            className="mt-1 mb-6 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {value?.data.columns.map((column) => {
              return <option value={column.id}>{column.id}</option>;
            })}
          </Field>
          <h2 className="block text-xl font-medium text-gray-700 mb-5">
            Vertical Axis
          </h2>
          <label
            htmlFor="yAxis"
            className="block text-sm font-medium text-gray-700"
          >
            Select Column
          </label>
          <Field
            as="select"
            id="yAxis"
            name="yAxis"
            className="mt-1 mb-6 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {value?.data.columns.map((column) => {
              return <option value={column.id}>{column.id}</option>;
            })}
          </Field>
          <button
            className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            type="submit"
          >
            Update Chart
          </button>
        </Form>
      </Formik>
    </div>
  );
}

function mapToChart(
  value: ColumnDetails[],
  key: string,
  idx: string,
  indexName: string
): Record<string, string> {
  var obj: Record<string, string> = {};
  obj[indexName] = key;
  obj[idx] = value.map((row) => row[idx]).reduce((prev, next) => prev + next);
  return obj;
}

const groupByToMap = <T, Q>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => Q
) =>
  array.reduce((map, value, index, array) => {
    const key = predicate(value, index, array);
    map.get(key)?.push(value) ?? map.set(key, [value]);
    return map;
  }, new Map<Q, T[]>());
