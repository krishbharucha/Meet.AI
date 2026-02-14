// // import { betterAuth } from "better-auth";
// // import { drizzleAdapter } from "better-auth/adapters/drizzle";
// // import { polar, checkout, portal } from "@polar-sh/better-auth";

// // import { db } from "@/db";
// // import * as schema from "@/db/schema";

// // import { polarClient } from "./polar";

// // export const auth = betterAuth({
// //   plugins: [
// //     polar({
// //       client: polarClient,
// //       createCustomerOnSignUp: true,
// //       use: [
// //         checkout({
// //           authenticatedUsersOnly: true,
// //           successUrl: "/upgrade",
// //         }),
// //         portal(),
// //       ],
// //     }),
// //   ],
// //   socialProviders: {
// //     github: { 
// //       clientId: process.env.GITHUB_CLIENT_ID as string, 
// //       clientSecret: process.env.GITHUB_CLIENT_SECRET as string, 
// //     },
// //     google: { 
// //       clientId: process.env.GOOGLE_CLIENT_ID as string, 
// //       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
// //     }, 
// //   },
// //   emailAndPassword: {
// //     enabled: true,
// //   },
// //   database: drizzleAdapter(db, {
// //     provider: "pg",
// //     schema: {
// //       ...schema,
// //     },
// //   }),
// // });

// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";

// import { db } from "@/db";
// import * as schema from "@/db/schema";

// import { polarClient } from "./polar";

// // Polar is optional. If POLAR_ACCESS_TOKEN is not set, auth works without billing.
// const plugins = [];

// if (process.env.POLAR_ACCESS_TOKEN && polarClient) {
//   // eslint-disable-next-line @typescript-eslint/no-var-requires
//   const { polar, checkout, portal } = require("@polar-sh/better-auth");

//   plugins.push(
//     polar({
//       client: polarClient,
//       createCustomerOnSignUp: true,
//       use: [
//         checkout({
//           authenticatedUsersOnly: true,
//           successUrl: "/upgrade",
//         }),
//         portal(),
//       ],
//     })
//   );
// }

// export const auth = betterAuth({
//   plugins,
//   socialProviders: {
//     github: {
//       clientId: process.env.GITHUB_CLIENT_ID as string,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
//     },
//     google: {
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     },
//   },
//   emailAndPassword: {
//     enabled: true,
//   },
//   database: drizzleAdapter(db, {
//     provider: "pg",
//     schema: {
//       ...schema,
//     },
//   }),
// });

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { BetterAuthOptions } from "better-auth";
import { polar, checkout, portal } from "@polar-sh/better-auth";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { polarClient } from "./polar";

// Type-safe plugins array without using `any`
const plugins: NonNullable<BetterAuthOptions["plugins"]> = [];

// Only enable Polar if configured
if (process.env.POLAR_ACCESS_TOKEN && polarClient) {
  plugins.push(
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          authenticatedUsersOnly: true,
          successUrl: "/upgrade",
        }),
        portal(),
      ],
    })
  );
}

export const auth = betterAuth({
  plugins,
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});
