import { Suspense, lazy, ElementType } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import LoadingScreen from '../components/LoadingScreen';
import AuthGuard from 'src/guards/AuthGuard';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/dashboard')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard/one" replace />,
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/dashboard/one" replace />, index: true },
        { path: 'one', element: <PageOne /> },
        { path: 'two', element: <PageTwo /> },
        { path: 'three', element: <PageThree /> },
        { path: 'charecter', element: <CharacterList /> },
        { path: 'todo', element: <Todo /> },
        { path: 'questions/:questionId', element: <QuestionPage /> },
        { path: 'questions', element: <QuestionHomePage /> },
        { path: 'questions/ask', element: <AskPage /> },
        { path: 'board', element: <KanbanPage /> },
        { path: 'chat', element: <SignalrPage /> },
        { path: 'invoice', element: <InvoicePage /> },

        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/four" replace />, index: true },
            { path: 'four', element: <PageFour /> },
            { path: 'five', element: <PageFive /> },
            { path: 'six', element: <PageSix /> },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// Dashboard
const PageOne = Loadable(lazy(() => import('../pages/PageOne')));
const PageTwo = Loadable(lazy(() => import('../pages/PageTwo')));
const PageThree = Loadable(lazy(() => import('../pages/PageThree')));
const PageFour = Loadable(lazy(() => import('../pages/PageFour')));
const PageFive = Loadable(lazy(() => import('../pages/PageFive')));
const PageSix = Loadable(lazy(() => import('../pages/PageSix')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
const CharacterList = Loadable(lazy(() => import('../projects/CharacterList')));
const Todo = Loadable(lazy(() => import('../max/Todo')));
const QuestionPage = Loadable(lazy(() => import('../question/QuestionPage')));
const QuestionHomePage = Loadable(lazy(() => import('../question/HomePage')));
const AskPage = Loadable(lazy(() => import('../question/AskPage')));
const KanbanPage = Loadable(lazy(() => import('../shreyu/Board/KanbanPage')));
const SignalrPage = Loadable(lazy(() => import('../chat/SignalrPage')));
const InvoicePage = Loadable(lazy(() => import('../invoice/InvoicePage')));
