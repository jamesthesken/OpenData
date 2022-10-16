import "regenerator-runtime/runtime";
import React, { useState, useEffect } from "react";
import { useTable, useGlobalFilter, useAsyncDebounce } from "react-table";
import axios from "axios";

interface ColumnDetails {
  [key: string]: string;
  id: string;
}

interface Column {
  Header: string;
  accessor: string;
}

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
      />
    </span>
  );
}

export default function Table() {
  const [apiData, setRowData] = useState<ColumnDetails[]>([]);
  const [cols, setColHeaders] = useState<ColumnDetails[]>([]);

  useEffect(() => {
    axios
      .get(
        "https://opendata.hawaii.gov/api/3/action/datastore_search?resource_id=caf4dc69-cf11-43dc-b4f9-3c29156d7630"
      )
      .then(function (response) {
        // TODO: catch errors and present to user
        // handle success
        setRowData(response.data.result.records);
        setColHeaders(response.data.result.fields);
      });
  });

  const data = React.useMemo<ColumnDetails[]>(() => apiData, [apiData]);

  const columns = React.useMemo<Column[]>(
    () => cols.map((col) => ({ Header: col.id, accessor: col.id })),
    [cols]
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state, // new
    preGlobalFilteredRows, // new
    setGlobalFilter, // new,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter
  );

  // Render the UI for your table
  return (
    <>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table {...getTableProps()} style={{ border: "solid 1px" }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
