import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import RouteErrorBoundary from "./components/Error/RouteErrorBoundary";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import HomePage from "./pages/Home/HomePage";
import LessonsPage from "./pages/Lesson/LessonsPage";
import LessonDetailPage from "./pages/Lesson/LessonDetailPage";
import QuizPage from "./pages/Quiz/QuizPage";
import QuizzesPage from "./pages/Quiz/QuizzesPage";
import AnalyticsPage from "./pages/Analytics/AnalyticsPage";
import { LessonService } from "./services/LessonService";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
      errorElement: <RouteErrorBoundary />,
    },
    {
      element: <ProtectedRoute />,
      errorElement: <RouteErrorBoundary />,
      children: [
        {
          path: "/",
          element: <Layout />,
          errorElement: <RouteErrorBoundary />,
          children: [
            {
              index: true,
              element: <HomePage />,
              loader: () => LessonService.getAllLessons(),
              errorElement: <RouteErrorBoundary />,
            },
            {
              path: "lessons",
              element: <LessonsPage />,
              loader: () => LessonService.getAllLessons(),
              errorElement: <RouteErrorBoundary />,
            },
            {
              path: "lessons/:id",
              element: <LessonDetailPage />,
              errorElement: <RouteErrorBoundary />,
            },
            {
              path: "lessons/:id/quiz",
              element: <QuizPage />,
              errorElement: <RouteErrorBoundary />,
            },
            {
              path: "quizzes",
              element: <QuizzesPage />,
              errorElement: <RouteErrorBoundary />,
            },
            {
              path: "analytics",
              element: <AnalyticsPage />,
              errorElement: <RouteErrorBoundary />,
            },
            {
              path: "profile",
              element: <AnalyticsPage />,
              errorElement: <RouteErrorBoundary />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
