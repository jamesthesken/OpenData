import "../styles/globals.css";
import type { AppProps } from "next/app";
import { DataProvider } from "../hooks/useData";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <Component {...pageProps} />
      </DataProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
