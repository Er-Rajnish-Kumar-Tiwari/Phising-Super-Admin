import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/auth/pages/ForgotPasswordPage";
// import Employees from "./pages/dashboard/pages/Employees/index.tsx";
import ResetPasswordPage from "./pages/auth/pages/ResetPasswordPage";
import SignupPage from "./pages/auth/pages/SignupPage";
import LoginPage from "./pages/auth/pages/LoginPage";
// import DashboardPage from "./pages/dashboard/pages/Dashboard/index.tsx";
// import MultiStepForm from "./pages/dashboard/pages/Campaign";
// import Campaign from "./pages/dashboard/pages/Campaign/CampaignForm/MultiStepping/demo";
// import Campaign from "./pages/dashboard/pages/Campaign/index.tsx";
// import Settings from "./pages/dashboard/pages/Settings/index.tsx";
// import ReportingPage from "./pages/dashboard/pages/Reporting/index.tsx";
import DarkMonitoringe from "./pages/dashboard/pages/DarkMonitoringe";
import Incident from "./pages/dashboard/pages/Incident";
import EmailTracker from "./pages/EmailTracker";
// Lazy load pages
// const App = lazy(() => import("./App"));
// const Sitemap = lazy(() => import("./pages/Sitemap"));
import AuthLayout from "./pages/auth/AuthLayout.tsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.tsx";
import Loader from "./components/Loader/index.tsx";
import Dashboard from "./pages/dashboard/pages/Dashboard/index.tsx";
// import Course from "./pages/dashboard/pages/Course/index.tsx";
// const LoginPage = lazy(() => import("./pages/auth/pages/LoginPage"));
// const SignupPage = lazy(() => import("./pages/auth/pages/SignupPage"));
// const DashboardLayout = Loadable(lazy(() => import("./pages/dashboard/DashboardLayout")));
const DashboardPage=lazy(()=>import("./pages/dashboard/pages/Dashboard/index.tsx"))

const CampaignPage=lazy(()=>import("./pages/dashboard/pages/Campaign/index.tsx"))
const EmployeesPage=lazy(()=>import("./pages/dashboard/pages/Employees/index.tsx"))
const ReportingPage=lazy(()=>import("./pages/dashboard/pages/Reporting/index.tsx"))
const SettingsPage=lazy(()=>import("./pages/dashboard/pages/Settings/index.tsx"))

// const ReportingPage = lazy(() => import("./pages/dashboard/pages/Reporting"));

export const Router = createBrowserRouter([
  {
    path: "/auth",
    element: (
        <AuthLayout />
    ),
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <SignupPage />,
      },
      {
        path: "Recover",
        element: <ForgotPassword />,
      },
      {
        path: "RecoverConfirm",
        element: <ResetPasswordPage />,
      },
    ],
  },
  {
    path: "/tracking/email-click",
    element: <EmailTracker />,
  },
  {
    path: "/super-admin",
    element: <Dashboard />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // {
      //   path: "/",
      //   element: <DashboardPage />,
      // },
      { index: true, 
        element:(
          <Suspense fallback={
          <div className='w-full h-svh flex justify-center items-center bg-[#F8F9FA]'>
            <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600"></div>
          </div>
        }>
            <DashboardPage />
          </Suspense> 
        )
        
      },
      

      {
        path: "campaign",
        element:(
          <Suspense fallback={<Loader/>}>
            <CampaignPage/>,
          </Suspense> 
        )
      },
      {
        path: "employee",
        element:(<Suspense fallback={<Loader/>}>
        <EmployeesPage/>,
      </Suspense>),
      },
      {
        path: "reporting",
        element:(<Suspense fallback={<Loader/>}>
          <ReportingPage/>,
        </Suspense>),
      },
      {
        path: "dark-monitoringe",
        element: (<Suspense fallback={<Loader/>}>
          <DarkMonitoringe/>,
        </Suspense>),
      },
      {
        path: "incident",
        element: (<Suspense fallback={<Loader/>}>
          <Incident/>,
        </Suspense>),
      },
      {
        path: "setting",
        element: (<Suspense fallback={<Loader/>}>
          <SettingsPage/>,
        </Suspense>),
      },
      
    ],
  },
]);

