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
    id: '1',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: '2',
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
    id: '21',
    title: 'TMS Operation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: '22',
        title: 'In Check',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '35',
            title: 'ICD/Other',
            type: 'item',
            classes: 'nav-item',
            url: 'tms-operation/in-check',
            icon: 'left-circle'
          },
          {
            id: '36',
            title: 'TMS',
            type: 'item',
            classes: 'nav-item',
            url: 'tms-operation/inbound-check',
            icon: 'left-circle'
          },
        ]
      },
      {
        id: '37',
        title: 'Out Check',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '38',
            title: 'ICD/Other',
            type: 'item',
            classes: 'nav-item',
            url: 'tms-operation/out-check',
            icon: 'left-circle'
          },
          {
            id: '39',
            title: 'TMS',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
        ]
      },
    ]
  },
  {
    id: '24',
    title: 'Report',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: '25',
        title: 'InBound Rpt',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '26',
            title: 'Report1',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
          {
            id: '27',
            title: 'Report2',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
        ]
      },
      {
        id: '28',
        title: 'OutBound Rpt',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '29',
            title: 'Report1',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
          {
            id: '30',
            title: 'Report2',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
        ]
      },
    ]
  },
  {
    id: '3',
    title: 'Master & Profile',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: '4',
        title: 'TMS Data',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '5',
            title: 'Yard',
            type: 'item',
            classes: 'nav-item',
            url: 'master/yard',
            icon: 'left-circle'
          },
          {
            id: '6',
            title: 'Gate',
            type: 'item',
            classes: 'nav-item',
            url: 'master/gate',
            icon: 'left-circle'
          },
          // {
          //   id: '7',
          //   title: 'Waiting Area',
          //   type: 'item',
          //   classes: 'nav-item',
          //   url: 'master/waiting-area',
          //   icon: 'left-circle'
          // },
          {
            id: '8',
            title: 'Weight Bridge',
            type: 'item',
            classes: 'nav-item',
            url: 'master/weight-bridge',
            icon: 'left-circle'
          },
          {
            id: '9',
            title: 'Operation Area',
            type: 'item',
            classes: 'nav-item',
            url: 'master/operation-area',
            icon: 'left-circle'
          },
        ]
      },
      {
        id: '9',
        title: 'Truck Data',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '10',
            title: 'Truck Type',
            type: 'item',
            classes: 'nav-item',
            url: 'master/truck-type',
            icon: 'left-circle'
          },
          {
            id: '11',
            title: 'Transporter',
            type: 'item',
            classes: 'nav-item',
            url: 'master/transporter',
            icon: 'left-circle'
          },
          {
            id: '12',
            title: 'Truck',
            type: 'item',
            classes: 'nav-item',
            url: 'master/truck',
            icon: 'left-circle'
          },
          {
            id: '13',
            title: 'Trailer',
            type: 'item',
            classes: 'nav-item',
            url: 'master/trailer',
            icon: 'left-circle'
          }
        ]
      },
      {
        id: '14',
        title: 'Process Data',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          // {
          //   id: '15',
          //   title: 'Truck Job Type',
          //   type: 'item',
          //   classes: 'nav-item',
          //   url: 'master/truck-job-type',
          //   icon: 'left-circle'
          // },
          {
            id: '16',
            title: 'Category',
            type: 'item',
            classes: 'nav-item',
            url: 'master/category',
            icon: 'left-circle'
          },
          {
            id: '17',
            title: 'Card',
            type: 'item',
            classes: 'nav-item',
            url: 'master/card',
            icon: 'left-circle'
          },
          {
            id: '18',
            title: 'Document Setting',
            type: 'item',
            classes: 'nav-item',
            url: 'master/document-setting',
            icon: 'left-circle'
          }
        ]
      },
      {
        id: '19',
        title: 'Profile Data',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '20',
            title: 'Driver',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
        ]
      },
      // {
      //   id: 'gate',
      //   title: 'Gate',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: '/master/gate',
      //   icon: 'home',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'yard',
      //   title: 'Yard',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/yard',
      //   icon: 'home',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'weightbridge',
      //   title: 'Weight Bridge',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/weight-bridge',
      //   icon: 'setting',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'transportertype',
      //   title: 'Transporter Type',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/transporter-type',
      //   icon: 'setting',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'transporter',
      //   title: 'Transporter',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/transporter',
      //   icon: 'setting',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'trucktype',
      //   title: 'Truck Type',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/truck-type',
      //   icon: 'setting',
      //   breadcrumbs: false,
      // },
      // {
      //   id: 'truck',
      //   title: 'Truck',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/truck',
      //   icon: 'truck',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'truck-job-type',
      //   title: 'Truck Job Type',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/truck-job-type',
      //   icon: 'truck',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'truck-entry-type',
      //   title: 'Truck Entry Type',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/truck-entry-type',
      //   icon: 'truck',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'trailertype',
      //   title: 'Trailer Type',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/trailer-type',
      //   icon: 'setting',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'trailer',
      //   title: 'Trailer',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/trailer',
      //   icon: 'truck',
      //   breadcrumbs: false
      // },
      // {
      //   id: 'driver',
      //   title: 'Driver',
      //   type: 'item',
      //   classes: 'nav-item',
      //   url: 'master/driver',
      //   icon: 'user-add',
      //   breadcrumbs: false
      // }

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
    id: '31',
    title: 'Utilities',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: '32',
        title: 'User Management',
        type: 'collapse',
        classes: 'nav-item',
        url: '',
        icon: 'left-circle',
        children: [
          {
            id: '33',
            title: 'Gate User',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
          {
            id: '34',
            title: 'Weight Bridge User',
            type: 'item',
            classes: 'nav-item',
            url: 'master/driver',
            icon: 'left-circle'
          },
        ]
      }
    ]
  },
  // {
  //   id: 'utilities',
  //   title: 'Utilities',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'gateuser',
  //       title: 'Gate User',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/register',
  //       icon: 'user-add'
  //     },
  //     {
  //       id: 'wbuser',
  //       title: 'Weight Bridge User',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/register',
  //       icon: 'user-add'
  //     },
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
    //]
  //},

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
//39
