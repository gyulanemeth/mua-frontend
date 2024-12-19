# Mua-Frontend Documentation and Integration Guide

mua-frontend is a Vue 3 plugin that integrates seamlessly with mua-backend to provide a complete authentication and user management system. By combining mua-frontend and mua-backend, developers can easily implement a robust system featuring login, user management, admin tools, and more.

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

## Setup
### 1. Import and Configure the Plugin
In your `main.js` file:

```javascript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import MuaFrontend from 'mua-frontend';

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(MuaFrontend, {
    router,
    pinia,
    userComponents: {
      SignupSuccessMessage
    }
  })
  .mount('#app');

```

### 2. Pass Required Options

Mua-Frontend requires the following:

- **router**: The Vue Router instance for routing.
- **pinia**: The Pinia instance for state management.
- **userComponents**: Custom Vue components for specific UI messages (e.g., sign-up messages).

### 3. Add `<MuaErrorMessage />` to App.vue
To receive notifications, success messages, errors, and warnings, you must include the `<MuaErrorMessage />` component in your `App.vue`

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
AccountFinalizedMsg and VerifyEmailMsg has no default.
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
| `/`                                | `defaultRoute`                    | No                          | Default route, redirects to login                                |
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
| `/system-admins/change-password`   | `system-admins-changePassword`    | Yes                         | Change password page for system admins                            |
| `/system-admins/change-email`      | `system-admins-changeEmail`       | Yes                         | Change email page for system admins                               |
| `/system-admins/settings`          | `system-admins-settings`          | Yes                         | Settings page for system admins                                   |
| `/system-admins/:id`               | `system-admins-admin`             | Yes                         | Admin details page for system admins                              |
| `/accounts/login`                  | `accounts-login`                  | No                          | Login page for accounts                                           |
| `/accounts/login/:urlFriendlyName` | `accounts-loginWithUrlFriendlyName` | No                          | Login page for accounts with URL-friendly name                    |
| `/accounts/login-select`           | `accounts-login-select`           | No                          | Login select page for accounts                                    |
| `/accounts/finalize-registration`  | `accounts-finalize-registration`  | No                          | Finalize registration page for accounts                           |
| `/accounts/create-account`         | `accounts-create-account`         | No                          | Create account page for accounts                                  |
| `/accounts/create-password`        | `accounts-create-password`        | No                          | Create password page for accounts                                 |
| `/accounts/forgot-password`        | `accounts-forgot-password`        | No                          | Forgot password page for accounts                                 |
| `/accounts/verify-email`           | `accounts-verify-email`           | No                          | Email verification page for accounts                              |
| `/accounts/forgot-password/reset`  | `accounts-forgot-password-reset`  | No                          | Reset password page for accounts                                  |
| `/accounts/invitation/accept`      | `accounts-accept-invitation`      | No                          | Accept invitation page for accounts                               |
| `/accounts`                        | `accounts`                        | Yes                         | Main account page with child routes                               |
| `/accounts/:urlFriendlyName`       | `accounts-Default`                | Yes                         | Default account page (redirect to dashboard)                      |
| `/accounts/:urlFriendlyName/users` | `accounts-users`                  | Yes                         | User management page for accounts                                 |
| `/accounts/:urlFriendlyName/me`    | `accounts-me`                     | Yes                         | Profile page for the account owner                                |
| `/accounts/:urlFriendlyName/change-password` | `accounts-changePassword` | Yes                         | Change password page for the account owner                        |
| `/accounts/:urlFriendlyName/add-password`  | `accounts-add-password` | Yes                         | Add password page for the account owner                           |
| `/accounts/:urlFriendlyName/change-email`  | `accounts-changeEmail`  | Yes                         | Change email page for the account owner                           |
| `/accounts/:urlFriendlyName/settings`      | `accounts-settings`      | Yes                         | Settings page for the account owner                               |
| `/accounts/:urlFriendlyName/account`       | `accounts-account`       | Yes                         | Account details page for the account owner                        |
| `/redirect-to-login-message`      | `redirectToLoginMessage`         | No                          | Redirect to login message page                                    |
| `/:catchAll(.*)`                   | `notFound`                       | No                          | Catch-all page for unknown routes                                 |


### Token Validation and Redirection

Before route transitions, the following checks are performed:

1. **Token Check**: Verifies if the accessToken exists and is not expired. If invalid, the user is redirected to the login page.
2. **`urlFriendlyName` Check**: Ensures the urlFriendlyName in the URL matches the stored account name. If not, the route is updated.
3. **Protected Routes**: Routes with the requiresAuth flag check for a valid token and correct urlFriendlyName before allowing access.

### Logout Function
Path: `/logout`
- Clears the `accessToken` and `accountId` from `localStorage` and redirects to the login page.

