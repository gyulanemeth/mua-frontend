window.config = {
  apiBaseUrl: '<emailfox_api_url>',
  appBaseUrl: '<app.emailfox_app_url>',
  appName: 'MUA Account\'s UI',
  appTitle: 'MUA Account\'s UI',
  appIcon: 'https://codebluefox.com/wp-content/uploads/2022/08/Blue-Fox-Pvt-LTd-04.png',
  title: 'Account Panel',
  sideBarIcons: [
    {
      name: 'Dashboard',
      icon: 'mdi-view-dashboard',
      url: (params) => `<accounts.emailfox_app_url>/accounts/${params.urlFriendlyName}?token=${params.token}&accountId=${params.accountId}`
    },
    {
      name: 'Design Systems',
      icon: 'mdi-palette-outline',
      url: (params) => `<accounts.emailfox_app_url>/accounts/${params.urlFriendlyName}/design-systems?token=${params.token}&accountId=${params.accountId}`
    },
    {
      name: 'Projects',
      icon: 'mdi-folder-multiple-outline',
      url: (params) => `<accounts.emailfox_app_url>/accounts/${params.urlFriendlyName}/projects?token=${params.token}&accountId=${params.accountId}`
    }
  ]
}
