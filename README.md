# Mua-Frontend Documentation and Integration Guide

mua-frontend is a Vue 3 plugin that integrates seamlessly with mua-backend to provide a complete authentication and user management system. By combining mua-frontend and mua-backend, developers can easily implement a robust system featuring login, user management, admin tools, and more. The system is "slack-like," meaning it supports multiple workspaces where users can log into each workspace separately. Users can have distinct credentials for each workspace, such as different passwords or a mix of login methods like Google login for one and password login for another.

## Overview

mua-frontend simplifies the process of integrating authentication into your Vue applications. It includes prebuilt components, Pinia stores, and API connectors to enable:

- User authentication
- Admin and user-specific views
- Account and profile management
- Customizable UI and routing integration

## Features

- **Prebuilt Components**: Includes login, user, and admin views.
- **Stores**: Manages authentication, users and account states using Pinia.
- **Connectors**: Streamlined API communication with mua-Backend.
- **Customizable Views**: Easily integrate into your app's routing and layout.

## Getting Started
### Installation
Install mua-frontend via npm:

```sh
npm install mua-frontend
```

### Add `mua-backend` to your backend

You can find more details about `mua-backend` on its [npm page](https://www.npmjs.com/package/mua-backend) or [github repository](https://github.com/gyulanemeth/mua-backend). `mua-frontend` works seamlessly with `mua-backend` to provide a complete authentication and user management system

## Setup
### 1. Import and Configure the Plugin
In your `main.js` file:

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify'
import { createI18n } from 'vue-i18n'
import App from './App.vue';
import router from './router';
import MuaFrontend from 'mua-frontend';
import muaEnglish from 'mua-frontend/src/locales/en.json'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({})
const pinia = createPinia();
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: muaEnglish
  }
})

createApp(App)
  .use(i18n)
  .use(pinia)
  .use(vuetify)
  .use(MuaFrontend, {
    router,
    pinia,
    env: import.meta.env,
    userComponents: {}
  })
  .use(router)
  .mount('#app');

```

### 2. Mua-Frontend Required Options

Mua-Frontend requires the following:

- **router**: The Vue Router instance for routing.
- **pinia**: The Pinia instance for state management.
- **env**: App ENV variables
- **userComponents**: Custom Vue components for specific UI messages (e.g., sign-up messages).

### 3. App Required Options

Your app must have the following:

- **i18n**: Configures internationalization for translations and localization using vue-i18n.
- **pinia**: Sets up state management with Pinia.
- **vuetify**: Adds Material Design components and styling with Vuetify.
- **router**: Integrates the Vue Router instance for app routing.
These plugins are essential for the functionality and customization of your app.

### 4. Add `<MuaErrorMessage />` to App.vue

To receive Mua operation notifications in your Vue 3 app, add the `<MuaErrorMessage />` component to `App.vue`. This component will display a snackbar that slides down from the top with messages for success, errors, and warnings. The success messages will appear with a green background, errors with a red background, and warnings with a yellow background. To trigger the notifications, use a method or store action after operations like user actions to show the relevant message in the snackbar.

### 5. Add to app `.env` file
Mua-Frontend requires the following variables to be included in your `.env` file

```bash
VITE_APP_TERMS_URL=<url>
VITE_APP_PRIVACY_URL=<url>
VITE_APP_NAME=<app_name>
VITE_APP_TITLE=<app_title>
VITE_APP_BASE_URL=<app_url>
VITE_AUTH_PROVIDERS=['google', 'github', 'microsoft']
```

#### Explanation of Variables:

- **`VITE_APP_TERMS_URL`**: The URL to your Terms and Conditions page. This link will be displayed in relevant parts of the app to provide access to your terms.
- **`VITE_APP_PRIVACY_URL`**: The URL to your Privacy Policy page. This link will be shown wherever privacy details need to be shared with users.
- **`VITE_APP_NAME`**: The name of your application, which will be displayed in places like the navbar, loading screens, and headers.
- **`VITE_APP_TITLE`**: The title of your application, used in browser titles or other display areas where a more descriptive name is needed.
- **`VITE_APP_BASE_URL`**: The base URL of your backend server. This is used by the app to communicate with your backend services.

- **`VITE_AUTH_PROVIDERS`**: An array of OAuth providers, which can include `'google'`, `'github'`, and `'microsoft'`. These providers must be properly configured in [mua-backend](https://www.npmjs.com/package/mua-backend). If setup is complete for any of these providers, adding them here will automatically enable them in your app for user authentication.

### 6. Add to `vite.config.js` file
To ensure proper optimization of dependencies, include the following in your `vite.config.js`

```javascript
export default defineConfig({
  optimizeDeps: {
    include: ['qs', 'vue3-apexcharts'],
  },
});
```

#### Explanation
The `optimizeDeps.include` option tells Vite to pre-bundle specific dependencies during the development build. This can:

1. **Improve Startup Time**: By pre-bundling, Vite optimizes these dependencies, reducing the time taken to load them during development.
2. **Ensure Compatibility**: Some packages (like `qs` and `vue3-apexcharts`) may require explicit inclusion to avoid issues like failed imports or slow performance.
This setup ensures that these dependencies are ready for use and integrated seamlessly.


## Customization
### Custom Components
Pass custom components to Mua-Frontend to fit your app's needs.

- **FinalizeRegistrationLinks**: Links displayed under the AccountFinalizedMsg and VerifyEmailMsg templates.
- **VerifyEmailMsg**: A message displayed after the user verifies their email.
- **CustomSystemStats**: Displays system statistics in the user and admin dashboards.

```javascript
{    
    userComponents: {
      FinalizeRegistrationLinks,
      AccountFinalizedMsg,
      VerifyEmailMsg,
      CustomSystemStats
    }
}
```

::: warning
AccountFinalizedMsg and VerifyEmailMsg has no default. Not providing them means users will not receive a welcome message after completing registration or verifying their email.
:::


## Admin Features

Admins can:

- View and manage all accounts
- Overall accounts statistics
- Access system settings
- Manage users within an account
- User Features

Users can:

- Access account-specific details
- Update their profile and account settings



## `mua-frontend` Store Exports

The `mua-frontend` package exports the following stores, which allow users to interact with accounts, users, and admins:

- `useMuaAccountStore`
- `useMuaUsersStore`
- `useMuaAdminsStore`

Each store provides various methods to manage and interact with the respective entities.

---

### Account Store (`useMuaAccountStore`)

Methods for managing accounts:

#### Methods

- **load**: Load account data.
- **loadMore**: Load additional account data.
- **async createOneByAdmin(formData)**: Create an account by an admin.
- **async createAccount(formData)**: Create a new account.
- **async readOne()**: Get details of a single account.
- **async patchAccountName({ user, name })**: Update account name.
- **async patchUrlFriendlyName(newUrlFriendlyName)**: Update the URL-friendly name for the account.
- **async uploadLogo(formData)**: Upload a logo for the account.
- **async deleteLogo()**: Delete the account logo.
- **async deleteAccount(password)**: Delete the account using a password.
- **async getAccountByUrlFriendlyName(urlFriendlyName)**: Retrieve an account using its URL-friendly name.

---

### User Store (`useMuaUsersStore`)

Methods for managing users:

#### Methods

- **load**: Load user data.
- **loadMore**: Load more user data.
- **patchRole**: Modify a user's role.
- **async deleteOne({ id, password, accountId })**: Delete a user account.
- **async login(token, password, accountId)**: Log in a user with the provided token and credentials.
- **async loginWithUrlFriendlyName(params)**: Log in with a URL-friendly name.
- **async getAccessToken(loginToken)**: Get an access token using the login token.
- **async loginWithProvider({ id, provider })**: Log in with a third-party provider.
- **async createWithProvider({ accountId, userId, provider })**: Create a user with a third-party provider.
- **async linkToProvider({ accountId, id, provider })**: Link a user account to a third-party provider.
- **async disconnectProvider({ id, password, accountId, provider })**: Disconnect a third-party provider from a user account.
- **async loginGetAccounts(email)**: Get accounts associated with the email during login.
- **async getRecentLoginsAccounts()**: Retrieve a list of recent logins by users.
- **async removeRecentLoginAccount(urlFriendlyName)**: Remove a recent login account.
- **logout()**: Log out the user.
- **async sendForgotPassword(data)**: Send a forgot password email.
- **async resetForgotPassword(forgotPasswordToken, newPassword, newPasswordAgain)**: Reset the user’s password.
- **async sendInvitation(email)**: Send an invitation email to a user.
- **async reSendInvitation(email)**: Resend an invitation email.
- **async acceptInvitation(acceptInvitationToken, newPassword, newPasswordAgain, name)**: Accept an invitation and set the user’s password.
- **async readOne()**: Get details of the logged-in user.
- **async patchUserName(name)**: Update the user’s name.
- **async patchPassword(oldPassword, newPassword, newPasswordAgain)**: Update the user’s password.
- **async createPassword({ token, id, accountId })**: Create a password during user registration.
- **async reSendFinalizeRegistration({ accountId, userId })**: Resend the final registration email.
- **async finalizeRegistration(token)**: Finalize the user’s registration.
- **async patchEmail(newEmail, newEmailAgain)**: Update the user’s email.
- **async patchEmailConfirm(token)**: Confirm the user’s new email.
- **async uploadProfilePicture(formData)**: Upload a new profile picture.
- **async deleteProfilePicture()**: Delete the user’s profile picture.

---

### Admin Store (`useMuaAdminsStore`)

Methods for managing admins:

#### Methods

- **load**: Load admin data.
- **loadMore**: Load more admin data.
- **delete**: Delete an admin account.
- **async deleteOne({ id, password })**: Delete an admin account by ID and password.
- **async login(email, password)**: Log in as an admin.
- **logout()**: Log out the admin.
- **async sendForgotPassword(email)**: Send a forgot password email to the admin.
- **async resetForgotPassword(forgotPasswordToken, newPassword, newPasswordAgain)**: Reset an admin’s password.
- **async sendInvitation(email)**: Send an invitation email to an admin.
- **async reSendInvitation(email)**: Resend an admin invitation email.
- **async acceptInvitation(acceptInvitationToken, newPassword, newPasswordAgain, name)**: Accept an admin invitation and set a new password.
- **async refreshAccessToken()**: Get admin’s access token.
- **async patchName(name)**: Update the admin’s name.
- **async patchPassword(oldPassword, newPassword, newPasswordAgain)**: Change the admin’s password.
- **async patchEmail(newEmail, newEmailAgain)**: Update the admin’s email.
- **async patchEmailConfirm(token)**: Confirm the admin’s updated email.
- **async readOne()**: Get details of the logged-in admin.
- **async uploadProfilePicture(formData)**: Upload the admin’s profile picture.
- **async deleteProfilePicture()**: Delete the admin’s profile picture.



## Route Documentation


### `requiresAuth`:
- **true**: The route requires authentication (user must be logged in).
- **false**: The route is accessible without authentication.

::: warning
**Adding `requiresAuth` in route meta:**
- Set `requiresAuth: true` for routes that require authentication.
- Set `requiresAuth: false` for routes that don’t require authentication.
:::


### Route Table

| **Path**                          | **Name**                          | **Requires Authentication** | **Description**                                                   |
|------------------------------------|-----------------------------------|-----------------------------|-------------------------------------------------------------------|
| `/`                                | `default-route`                    | No                          | Default route, redirects to accounts login `accounts/login`                               |
| `/provider-auth`                   | `provider-auth`                   | No                          | Route for provider authentication                                |
| `/system-admins/login`             | `system-admins-login`             | No                          | Login page for system admins                                     |
| `/system-admins/forgot-password`   | `system-admins-forgot-password`   | No                          | Forgot password page for system admins                            |
| `/system-admins/forgot-password/reset` | `system-admins-forgot-password-reset` | No                          | Reset password page for system admins                             |
| `/system-admins/invitation/accept` | `system-admins-accept-invitation` | No                          | Accept invitation page for system admins                          |
| `/system-admins/verify-email`      | `system-admins-verify-email`      | No                          | Email verification page for system admins                         |
| `/system-admins`                   | `system-admins-main`              | Yes                         | Main page for system admins                                       |
| `/system-admins/admins`            | `system-admins`                   | Yes                         | Admin management page                                             |
| `/system-admins/dashboard`         | `admins-dashboard`                | Yes                         | Dashboard page for system admins                                  |
| `/system-admins/accounts`          | `system-admins-accounts`          | Yes                         | Accounts management page for system admins                        |
| `/system-admins/me`                | `system-admins-me`                | Yes                         | Profile page for system admins                                    |
| `/system-admins/change-password`   | `system-admins-change-password`    | Yes                         | Change password page for system admins                            |
| `/system-admins/change-email`      | `system-admins-change-email`       | Yes                         | Change email page for system admins                               |
| `/system-admins/settings`          | `system-admins-settings`          | Yes                         | Settings page for system admins                                   |
| `/system-admins/:id`               | `system-admins-admin`             | Yes                         | Admin details page for system admins                              |
| `/accounts/login`                  | `accounts-login`                  | No                          | Login page for accounts                                           |
| `/accounts/login/:urlFriendlyName` | `accounts-login-with-urlFriendlyName` | No                          | Login page for accounts with URL-friendly name                    |
| `/accounts/login-select`           | `accounts-login-select`           | No                          | Login select page for accounts                                    |
| `/accounts/finalize-registration`  | `accounts-finalize-registration`  | No                          | Finalize registration page for accounts                           |
| `/accounts/create-account`         | `accounts-create-account`         | No                          | Create account page for accounts                                  |
| `/accounts/create-password`        | `accounts-create-password`        | No                          | Create password page for accounts                                 |
| `/accounts/forgot-password`        | `accounts-forgot-password`        | No                          | Forgot password page for accounts                                 |
| `/accounts/verify-email`           | `accounts-verify-email`           | No                          | Email verification page for accounts                              |
| `/accounts/forgot-password/reset`  | `accounts-forgot-password-reset`  | No                          | Reset password page for accounts                                  |
| `/accounts/invitation/accept`      | `accounts-accept-invitation`      | No                          | Accept invitation page for accounts                               |
| `/accounts`                        | `accounts`                        | Yes                         | Main account page with child routes                               |
| `/accounts/:urlFriendlyName`       | `accounts-default`                | Yes                         | Default account page (redirect to dashboard)                      |
| `/accounts/:urlFriendlyName/users` | `accounts-users`                  | Yes                         | User management page for accounts                                 |
| `/accounts/:urlFriendlyName/me`    | `accounts-me`                     | Yes                         | Profile page for the account owner                                |
| `/accounts/:urlFriendlyName/change-password` | `accounts-change-password` | Yes                         | Change password page for the account owner                        |
| `/accounts/:urlFriendlyName/add-password`  | `accounts-add-password` | Yes                         | Add password page for the account owner                           |
| `/accounts/:urlFriendlyName/change-email`  | `accounts-change-email`  | Yes                         | Change email page for the account owner                           |
| `/accounts/:urlFriendlyName/settings`      | `accounts-settings`      | Yes                         | Settings page for the account owner                               |
| `/accounts/:urlFriendlyName/account`       | `accounts-account`       | Yes                         | Account details page for the account owner                        |
| `/redirect-to-login-message`      | `redirect-to-login-message`         | No                          | Redirect to login message page                                    |
| `/:catchAll(.*)`                   | `notFound`                       | No                          | Catch-all page for unknown routes                                 |


### Token Validation and Redirection

Before route transitions, the following checks are performed:

1. **Token Check**: Verifies if the accessToken exists and is not expired. If invalid, the user is redirected to the login page.
2. **`urlFriendlyName` Check**: Ensures the urlFriendlyName in the URL matches the stored account name. If not, the route is updated.
3. **Protected Routes**: Routes with the requiresAuth flag check for a valid token and correct urlFriendlyName before allowing access.

### Logout Function
Path: `/logout`
- Clears the `accessToken` and `accountId` from `localStorage` and redirects to the login page.

