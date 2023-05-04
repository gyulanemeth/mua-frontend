window.config = {
  accountsApiBaseUrl: '<accounts.emailfox_api_url>',
  adminApiBaseUrl: '<admins.emailfox_api_url>',
  adminsAppBaseUrl: '<admins.emailfox_app_url>',
  appBaseUrl: '<accounts.emailfox_app_url>',
  appName: 'MUA Account\'s UI',
  appTitle: 'MUA Account\'s UI',
  appIcon: 'https://codebluefox.com/wp-content/uploads/2022/08/Blue-Fox-Pvt-LTd-04.png',
  title: 'Account Panel',
  sideBarIcons: [
    {
      name: 'Email Application',
      icon: 'mdi-email-variant',
      url: (params) => `<accounts.emailfox_app_url>/accounts/${params.accountId}?token=${params.token}`
    },
    {
      name: 'Design System',
      icon: 'mdi-palette-outline',
      url: (params) => `<accounts.emailfox_app_url>/accounts/${params.accountId}/design-system?token=${params.token}`
    },
    {
      name: 'Projects',
      icon: 'mdi-card-account-details-outline',
      url: (params) => `<accounts.emailfox_app_url>/accounts/${params.accountId}/projects?token=${params.token}`
    }
  ]
}
