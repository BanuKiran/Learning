// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: getIcon('ic_user'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general v3.4.0',
    items: [
      { title: 'One', path: '/dashboard/one', icon: ICONS.dashboard },
      { title: 'Two', path: '/dashboard/two', icon: ICONS.ecommerce },
      { title: 'Three', path: '/dashboard/three', icon: ICONS.analytics },
    ],
  },

  {
    subheader: 'projects',
    items: [{ title: 'Characters', path: '/dashboard/charecter', icon: ICONS.dashboard }],
  },
  {
    subheader: 'invoice',
    items: [{ title: 'Invoice', path: '/dashboard/invoice', icon: ICONS.dashboard }],
  },
  {
    subheader: 'max',
    items: [{ title: 'Todo', path: '/dashboard/todo', icon: ICONS.dashboard }],
  },
  {
    subheader: 'ASP',
    items: [{ title: 'questions', path: '/dashboard/questions', icon: ICONS.dashboard }],
  },
  {
    subheader: 'Shreyu',
    items: [{ title: 'board', path: '/dashboard/board', icon: ICONS.dashboard }],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    subheader: 'management',
    items: [
      {
        title: 'user',
        path: '/dashboard/user',
        icon: ICONS.user,
        children: [
          { title: 'Four', path: '/dashboard/user/four' },
          { title: 'Five', path: '/dashboard/user/five' },
          { title: 'Six', path: '/dashboard/user/six' },
        ],
      },
    ],
  },
];

export default navConfig;
