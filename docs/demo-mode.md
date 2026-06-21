# 🛡️ Secure Sandboxed Demo Mode

Evolve Lab features a state-of-the-art **Demo Mode** which allows prospective users to test editing, deleting, borrowing, and managing inventories while maintaining **100% security and zero data loss on existing production records**.

---

## 🎯 The Core Concept: Write-Sandboxing

Rather than completely disabling database writes for guest accounts (which ruins the evaluation experience), Demo Mode uses a technique called **Write-Sandboxing**:

- **Real Database Data**: Standard production components, borrow requests, logs, and users are flagged with `isDemo: false`.
- **Demo-Isolated Data**: Any entity created, updated, or manipulated by a demo user is tagged with `isDemo: true`.
- **Automatic Pruning**: A scheduled cleanup daemon purges only the records matching `{ isDemo: true }` without touching or affecting production data.

---

## 🔒 Backend Isolation & Middlewares

Isolation is dynamically enforced at the controller entrypoint using `sandbox.middleware.js`:

### 1. Creating Sandboxed Items (`POST`)
When a demo user posts a new component, the sandbox middleware automatically intercepts the payload:
```javascript
req.body.isDemo = true;
req.body.createdBy = "demo";
```
This forces all newly spawned components to be isolated within the demo scope.

### 2. Guarding Production Records (`PUT` / `DELETE` / `PATCH`)
If a demo user attempts to modify or delete any component or request, the middleware intercepts the operation:
1. Fetches the target record by ID.
2. Checks the `isDemo` flag.
3. If `isDemo` is `false` (meaning it belongs to the active production database):
   - Instantly throws a `403 Forbidden` ApiError:
     ```json
     {
       "success": false,
       "message": "Action disabled in demo mode"
     }
     ```
   - Terminates the thread, preventing any execution or mutation database commands.
4. If `isDemo` is `true` (meaning it's a guest-created sandboxed item):
   - Allows the controller handler to execute the update/delete action.

### 3. General Routes Restriction (`restrictDemoGeneral`)
For general routes that do not support sandboxing (e.g. updating server-wide config, registering new users, managing directories):
- If the logged-in user is a demo account, all non-`GET` HTTP verbs are immediately blocked, returning a `403 Forbidden` response.

---

## 🧹 Background Seeding & Pruning Daemon

The setup and lifecycle of demo accounts are managed by `server/src/utils/demoSetup.js`:

### 1. Seeding Accounts
On server startup, the system automatically checks if the default demo credentials exist. If not, it seeds them:
- **Demo Manager**: `demo-manager@example.com` (password: `password`)
- **Demo User**: `demo-user@example.com` (password: `password`)
It also whitelists their emails in the `wishlists` collection to allow standard authentication flows.

### 2. Auto-Pruning Loop
To prevent cluttering, the system triggers a cleanup task immediately on boot and then **every 1 hour** via a background timer:
```javascript
const runCleanup = async () => {
  await Components.deleteMany({ isDemo: true });
  await Requests.deleteMany({ isDemo: true });
  await Logs.deleteMany({ isDemo: true });
};
```

> [!CAUTION]
> The selector `{ isDemo: true }` is highly specific. Your actual production records do not possess this flag, which guarantees that **no production data is ever deleted or modified by this daemon**.

---

## 🎨 Premium Frontend UX Integration

The client interface has been carefully styled to adapt dynamically to Demo Mode:

### 1. Alert Banner
When a user logs in with a demo account, `Layout.jsx` displays a sleek, glassmorphic electric-green warning banner at the top of the interface:
> 💡 **DEMO MODE**: You are currently operating inside a sandboxed environment. Operations on production data are restricted, but you can create and modify your own sandboxed records!

### 2. Dynamic UI Disabling & Custom Tooltips
Buttons for operations on production records (such as Edit, Delete, Approve, and Reject) are automatically locked:
- **Button Lock**: If `user.isDemo` is true AND `item.isDemo` is false, the buttons are grayed out, click-disabled, and set to `opacity-50`.
- **CSS Tooltips**: Hovering over locked buttons shows a modern, animated CSS tooltip stating *"Disabled in demo mode"*.
- **Interactive Sandboxes**: If the component is one that the demo user created (`item.isDemo: true`), the buttons remain fully enabled so users can practice editing and deleting their own mock entries.

### 3. Interactive Floating Credentials Drawer
At the login screen, a pulsing green capsule button labeled **"Demo Credentials"** sits in the bottom-right corner. When clicked, it expands into an elegant credentials console:
- **Details**: Clearly lists credentials and roles for the Manager and User accounts.
- **Copy**: Features one-click copy buttons that offer temporary visual checkmarks on success.
- **Autofill (DX Wizardry)**: A single click on the **Autofill** button automatically inputs the selected credentials and submits the sign-in form, providing a fast and premium test onboarding experience.
