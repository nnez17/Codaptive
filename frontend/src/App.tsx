import ReactDOM from "react-dom/client";
import "./global.css";
import Navbar from "./components/layout/navbar";
import Home from "./pages/landing/index";
import Footer from "./components/layout/footer";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import VerifyEmail from "./pages/auth/verifyEmail";
import ForgotPassword from "./pages/auth/forgotPassword";
import ResetPassword from "./pages/auth/resetPassword";
import Profile from "./pages/dashboard/user";
import Learn from "./pages/learn/index";
import Level from "./pages/learn/level";
import Lesson from "./pages/learn/lesson";
import Questions from "./pages/learn/questions";
import Profilebar from "./components/layout/profilebar";
import Settings from "./pages/settings/index";

import { AccountProvider } from "./contexts/account";
import { ThemeProvider } from "./contexts/themeProvider";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/layout/sidebar";
import { DashboardLayout } from "./components/layout/dashboard-layout";
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";
import NotificationProvider from "./contexts/notificationProvider";

import GlobalNotFound from "./pages/global-not-found";
import { LoadingSpinner } from "./components/common/loadingSpinner";
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

    const toHash = routerState.location.hash;
    const isTargetTransition =
      (toPath === "/" &&
        fromPath !== "/" &&
        !["community", "path"].includes(toHash)) ||
      (fromPath === "/" &&
        ["/profile", "/login", "/register"].includes(toPath));

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
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background animate-in fade-in duration-300">
          <LoadingSpinner size="lg" label="Loading Codaptive..." />
        </div>
      )}
      <Outlet />
    </>
  );
}

function LandingSidebarLayout() {
  return (
    <NotificationProvider>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </NotificationProvider>
  );
}

const landingSidebarLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "landing-sidebar-layout",
  component: LandingSidebarLayout,
});

function LandingLayout() {
  const routerState = useRouterState();
  const isRegisterPage = routerState.location.pathname === "/register";

  if (isRegisterPage) {
    return (
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh">
      <Navbar showTrigger={true} />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
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

const verifyEmailRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: "/verify-email/$token",
  component: VerifyEmail,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: "/forgot-password",
  component: ForgotPassword,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => landingRoute,
  path: "/reset-password/$token",
  component: ResetPassword,
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
      verifyEmailRoute,
      forgotPasswordRoute,
      resetPasswordRoute,
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
    <ThemeProvider defaultTheme="system" storageKey="codaptive-ui-theme">
      <AccountProvider>
        <RouterProvider router={router} />
      </AccountProvider>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(<App />);
