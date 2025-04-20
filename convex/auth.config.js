import { v } from "convex/values";

export default {
  providers: [
    {
      domain: "https://clerk.clerk.dev",
      applicationID: "convex",
    },
  ],
  roles: ["admin", "user"],
}; 