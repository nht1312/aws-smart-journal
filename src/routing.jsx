import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import CreateDiary from "./pages/create-diary";
import DiaryDetail from "./pages/diary-detail";
import YourDiary from "./pages/your-diary";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <YourDiary /> },
      { path: "new-diary", element: <CreateDiary /> },
      { path: "diary-detail/:id", element: <DiaryDetail /> }
    ]
  },
]);