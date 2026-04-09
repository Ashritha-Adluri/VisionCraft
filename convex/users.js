import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        picture: v.string()
    },
    handler: async (ctx, args) => {
        const userData = await ctx.db.query('users')
            .filter(q => q.eq(q.field('email'), args.email))
            .collect();
        if (userData?.length == 0) {
            const result = await ctx.db.insert('users', {
                name: args.name,
                email: args.email,
                picture: args.picture
            });
            return result;
        }
        return userData[0];
    }
})

export const getTheme = query({
    args: { userId: v.optional(v.id('users')) },
    handler: async (ctx, { userId }) => {
        if (!userId) return null;
        const user = await ctx.db.get(userId);
        return user?.themePreference || 'system';
    },
});

export const setTheme = mutation({
    args: { userId: v.id('users'), theme: v.union(v.literal('light'), v.literal('dark'), v.literal('system')) },
    handler: async (ctx, { userId, theme }) => {
        await ctx.db.patch(userId, { themePreference: theme });
    },
});