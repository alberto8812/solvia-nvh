import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout";
import { HomePage, JobsPage } from "@/pages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "careers", element: <JobsPage /> },
    ],
  },
]);
