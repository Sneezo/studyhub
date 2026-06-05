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
import { CmsTermsPage } from "./pages/CmsTermsPage";
import { CmsTermFormPage } from "./pages/CmsTermFormPage";
import { CmsReviewPage } from "./pages/CmsReviewPage";

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
        path: "cms/terms",
        element: <CmsTermsPage />,
      },
      {
        path: "cms/terms/new",
        element: <CmsTermFormPage mode="new" />,
      },
      {
        path: "cms/terms/:id/edit",
        element: <CmsTermFormPage mode="edit" />,
      },
      {
        path: "cms/review",
        element: <CmsReviewPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);