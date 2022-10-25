import { ReactNode, createContext, useState } from "react";

export const DataContext = createContext<DataContextType | null>(null);

export function DataProvider(props: { children: ReactNode }): JSX.Element {
  const [data, setData] = useState<DataContext>({ data: [] });

  const updateData = (data: ColumnDetails[]) => {
    setData({ data: data });
  };

  return (
    <DataContext.Provider value={{ data, updateData }}>
      {props.children}
    </DataContext.Provider>
  );
}
