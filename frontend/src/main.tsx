import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { NewsPage } from "./pages/NewsPage";
import { CmsDashboard } from "./pages/CmsDashboard";
import { CmsArticles } from "./pages/CmsArticles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "news",
        element: <NewsPage />,
      },
      {
        path: "cms",
        element: <CmsDashboard />,
      },
      {
        path: "cms/articles",
        element: <CmsArticles />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);