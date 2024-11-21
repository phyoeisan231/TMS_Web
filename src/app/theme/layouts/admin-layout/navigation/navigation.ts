export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard/default',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'master',
    title: 'Master',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'gate',
        title: 'Gate',
        type: 'item',
        classes: 'nav-item',
        url: '/master/gate',
        icon: 'home',
        breadcrumbs: false
      },
      {
        id: 'weightbridge',
        title: 'Weight Bridge',
        type: 'item',
        classes: 'nav-item',
        url: 'master/weight-bridge',
        icon: 'setting',
        breadcrumbs: false
      },
      {
        id: 'transportertype',
        title: 'Transporter Type',
        type: 'item',
        classes: 'nav-item',
        url: 'master/transporter-type',
        icon: 'setting',
        breadcrumbs: false
      },
      {
        id: 'transporter',
        title: 'Transporter',
        type: 'item',
        classes: 'nav-item',
        url: 'master/transporter',
        icon: 'setting',
        breadcrumbs: false
      },
      {
        id: 'trucktype',
        title: 'Truck Type',
        type: 'item',
        classes: 'nav-item',
        url: 'master/truck-type',
        icon: 'setting',
        breadcrumbs: false,
      },
      {
        id: 'truck',
        title: 'Truck',
        type: 'item',
        classes: 'nav-item',
        url: 'master/truck',
        icon: 'truck',
        breadcrumbs: false
      },
      // {
      //   id: 'trailertype',
      //   title: 'Trailer Type',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/trailer-type',
      //   icon: 'setting',
      //   breadcrumbs: false
      // },
      {
        id: 'trailer',
        title: 'Trailer',
        type: 'item',
        classes: 'nav-item',
        url: 'master/trailer',
        icon: 'truck',
        breadcrumbs: false
      },
      {
        id: 'driver',
        title: 'Driver',
        type: 'item',
        classes: 'nav-item',
        url: 'master/driver',
        icon: 'user-add',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'location',
    title: 'Location',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'waitingarea',
        title: 'Waiting Area',
        type: 'item',
        classes: 'nav-item',
        url: '/login',
        icon: 'left-circle',
        breadcrumbs: false,
      },
      {
        id: 'optarea',
        title: 'Operating Area',
        type: 'item',
        classes: 'nav-item',
        url: '/register',
        icon: 'left-circle',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'report',
    title: 'Report',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'report1',
        title: 'Report1',
        type: 'item',
        classes: 'nav-item',
        url: '/login',
        icon: 'profile',
        target: true,
        breadcrumbs: false,
      },
      {
        id: 'repoart2',
        title: 'Report2',
        type: 'item',
        classes: 'nav-item',
        url: '/register',
        icon: 'profile',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  // {
  //   id: 'authentication',
  //   title: 'Authentication',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'login',
  //       title: 'Login',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/login',
  //       icon: 'login',
  //       target: true,
  //       breadcrumbs: false,
  //     },
  //     {
  //       id: 'register',
  //       title: 'Register',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/register',
  //       icon: 'profile',
  //       target: true,
  //       breadcrumbs: false
  //     }
  //   ]
  // },
  {
    id: 'utilities',
    title: 'Utilities',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'gateuser',
        title: 'Gate User',
        type: 'item',
        classes: 'nav-item',
        url: '/register',
        icon: 'user-add'
      },
      {
        id: 'wbuser',
        title: 'Weight Bridge User',
        type: 'item',
        classes: 'nav-item',
        url: '/register',
        icon: 'user-add'
      },
      // {
      //   id: 'wbuser1',
      //   title: 'Weight Bridge User1',
      //   type: 'collapse',
      //   classes: 'nav-item',
      //   url: '',
      //   icon: 'user-add',
      //   children: [
      //     {
      //       id: '2',
      //       title: 'Test2',
      //       type: 'item',
      //       classes: 'nav-item',
      //       url: '/master/gate',
      //       icon: 'user-add'
      //     },
      //   ]
      // }
      // {
      //   id: 'tabler',
      //   title: 'Tabler',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'https://ant.design/components/icon',
      //   icon: 'ant-design',
      //   target: true,
      //   external: true
      // }
    ]
  },

  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'chrome'
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/mantis-angular/',
  //       icon: 'question',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // }
];
