// import { eq, count } from "drizzle-orm";

// import { db } from "@/db";
// import { polarClient } from "@/lib/polar";
// import { agents, meetings } from "@/db/schema";
// import {
//   createTRPCRouter,
//   protectedProcedure,
// } from "@/trpc/init";

// export const premiumRouter = createTRPCRouter({
//   getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
//     const customer = await polarClient.customers.getStateExternal({
//       externalId: ctx.auth.user.id,
//     });

//     const subscription = customer.activeSubscriptions[0];

//     if (!subscription) {
//       return null;
//     }

//     const product = await polarClient.products.get({
//       id: subscription.productId,
//     });

//     return product;
//   }),
//   getProducts: protectedProcedure.query(async () => {
//     const products = await polarClient.products.list({
//       isArchived: false,
//       isRecurring: true,
//       sorting: ["price_amount"],
//     });

//     return products.result.items;
//   }),
//   getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
//     const customer = await polarClient.customers.getStateExternal({
//       externalId: ctx.auth.user.id,
//     });

//     const subscription = customer.activeSubscriptions[0];

//     if (subscription) {
//       return null;
//     }

//     const [userMeetings] = await db
//       .select({
//         count: count(meetings.id),
//       })
//       .from(meetings)
//       .where(eq(meetings.userId, ctx.auth.user.id));

//     const [userAgents] = await db
//       .select({
//         count: count(agents.id),
//       })
//       .from(agents)
//       .where(eq(agents.userId, ctx.auth.user.id));

//     return {
//       meetingCount: userMeetings.count,
//       agentCount: userAgents.count,
//     };
//   })
// });

import { eq, count } from "drizzle-orm";

import { db } from "@/db";
import { polarClient } from "@/lib/polar";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const premiumRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    // If Polar is disabled, act like user has no subscription
    if (!polarClient || !process.env.POLAR_ACCESS_TOKEN) {
      return null;
    }

    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.auth.user.id,
    });

    const subscription = customer.activeSubscriptions?.[0];

    if (!subscription) {
      return null;
    }

    const product = await polarClient.products.get({
      id: subscription.productId,
    });

    return product;
  }),

  getProducts: protectedProcedure.query(async () => {
    // If Polar is disabled, return no products (hide upgrade UI)
    if (!polarClient || !process.env.POLAR_ACCESS_TOKEN) {
      return [];
    }

    const products = await polarClient.products.list({
      isArchived: false,
      isRecurring: true,
      sorting: ["price_amount"],
    });

    return products.result.items;
  }),

  getFreeUsage: protectedProcedure.query(async ({ ctx }) => {
    // If Polar is enabled and user has a subscription, return null like before.
    // If Polar is disabled, always compute and return free usage.
    if (polarClient && process.env.POLAR_ACCESS_TOKEN) {
      const customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });

      const subscription = customer.activeSubscriptions?.[0];

      if (subscription) {
        return null;
      }
    }

    const [userMeetings] = await db
      .select({
        count: count(meetings.id),
      })
      .from(meetings)
      .where(eq(meetings.userId, ctx.auth.user.id));

    const [userAgents] = await db
      .select({
        count: count(agents.id),
      })
      .from(agents)
      .where(eq(agents.userId, ctx.auth.user.id));

    return {
      meetingCount: userMeetings?.count ?? 0,
      agentCount: userAgents?.count ?? 0,
    };
  }),
});
