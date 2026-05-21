// Role-based permissions mapping
export const permissions = {
  manager: [
    "view",
    "create",
    "edit",
    "delete",
    "manage_users",
    "view_all_requests"
  ],
  user: [
    "view",
    "create_request"
  ],
  demo: [
    "view",
    "view_all_requests"
  ]
};

