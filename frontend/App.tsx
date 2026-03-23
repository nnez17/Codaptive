import ReactDOM from "react-dom/client";
import "./global.css";
import Navbar from "./src/components/layout/navbar";
import Home from "./src/pages/landing/index";
import Footer from "./src/components/layout/footer";
import Login from "./src/pages/auth/login";
import Register from "./src/pages/auth/register";
import ForgotPassword from "./src/pages/auth/forgotPassword";
import Profile from "./src/pages/dashboard/profile";
import Learn from "./src/pages/learn/index";
import Level from "./src/pages/learn/level";
import Lesson from "./src/pages/learn/lesson";
import Questions from "./src/pages/learn/questions";
import Profilebar from "./src/components/layout/profilebar";
import Settings from "./src/pages/settings/index";

import { AccountProvider } from "./src/contexts/account";
import { SidebarInset, SidebarProvider } from "./src/components/ui/sidebar";
import { AppSidebar } from "./src/components/layout/sidebar";
import { DashboardLayout } from "./src/components/layout/dashboard-layout";
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import GlobalNotFound from "./src/pages/global-not-found";
import { LoadingSpinner } from "./src/components/common/loadingSpinner";
import { useEffect, useState } from "react";

const rootRoute = createRootRoute({
  component: RootComponent,
  notFoundComponent: GlobalNotFound,
});

function RootComponent() {
  const routerState = useRouterState();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fromPath =
      routerState.resolvedLocation?.pathname ?? routerState.location.pathname;
    const toPath = routerState.location.pathname;

    const isTargetTransition =
      (fromPath === "/" && toPath === "/profile") ||
      (fromPath === "/profile" && toPath === "/");

    if (routerState.status === "pending" && isTargetTransition) {
      setIsTransitioning(true);
    } else if (routerState.status !== "pending") {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [
    routerState.status,
    routerState.location.pathname,
    routerState.resolvedLocation?.pathname,
  ]);

  return (
    <>
      {isTransitioning && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white animate-in fade-in duration-300">
          <LoadingSpinner size="lg" label="Loading Codaptive..." />
        </div>
      )}
      <Outlet />
    </>
  );
}

function LandingSidebarLayout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}

const landingSidebarLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "landing-sidebar-layout",
  component: LandingSidebarLayout,
});

function LandingLayout() {
  return (
    <>
      <Navbar showTrigger={true} />
      <Outlet />
      <Footer />
    </>
  );
}

const landingRoute = createRoute({
  getParentRoute: () => landingSidebarLayoutRoute,
  id: "landing",
  component: LandingLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: "/",
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: "/register",
  component: Register,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: "/forgot-password",
  component: ForgotPassword,
});

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "dashboard-layout",
  component: DashboardLayout,
});

const profileRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/profile",
  component: Profile,
});

const settingsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/settings",
  component: Settings,
});

const learnWithDashboardLayoutRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  id: "learn-with-aside",
  component: () => (
    <>
      <Profilebar />
      <Outlet />
    </>
  ),
});

const learnIndexRoute = createRoute({
  getParentRoute: () => learnWithDashboardLayoutRoute,
  path: "/learn",
  component: Learn,
});

const learnLevelRoute = createRoute({
  getParentRoute: () => learnWithDashboardLayoutRoute,
  path: "/learn/$levelId",
  component: Level,
});

// Focused Lesson Layout - No Sidebar, No Profilebar
const focusedLessonRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "focused-lesson-layout",
  component: () => <Outlet />,
});

const learnLessonRoute = createRoute({
  getParentRoute: () => focusedLessonRoute,
  path: "/learn/$levelId/lesson/$lessonId",
  component: Lesson,
});

const learnQuestionsRoute = createRoute({
  getParentRoute: () => focusedLessonRoute,
  path: "/learn/$levelId/questions/$lessonId",
  component: Questions,
});

const routeTree = rootRoute.addChildren([
  landingSidebarLayoutRoute.addChildren([
    landingRoute.addChildren([
      indexRoute,
      loginRoute,
      registerRoute,
      forgotPasswordRoute,
    ]),
  ]),
  dashboardLayoutRoute.addChildren([
    profileRoute,
    settingsRoute,
    learnWithDashboardLayoutRoute.addChildren([
      learnIndexRoute,
      learnLevelRoute,
    ]),
  ]),
  focusedLessonRoute.addChildren([learnLessonRoute, learnQuestionsRoute]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <AccountProvider>
      <RouterProvider router={router} />
    </AccountProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(<App />);
