import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const CreateNewDesign = mutation({
    args: {
        name: v.string(),
        width: v.number(),
        height: v.number(),
        uid: v.optional(v.id("users")),
        type: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("designs", {
            name: args.name,
            height: args.height,
            width: args.width,
            uid: args.uid || null,
            type: args.type || "user",
        });
    },
});


export const GetDesign = query({
    args: {
        id: v.id('designs')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.get(args.id);
        return result;
    }
})

export const SaveDesign = mutation({
    args: {
        id: v.id('designs'),
        jsonDesign: v.any(),
        imagePreview: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.patch(args.id, {
            jsonTemplate: args.jsonDesign,
            imagePreview: args?.imagePreview
        })
        return result;
    }
})

export const GetUserDesigns = query({
    args: {
        uid: v.id('users')
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("designs")
            .filter((q) => q.and(
                q.eq(q.field("uid"), args.uid),
                q.eq(q.field("type"), "user")
            ))
            .collect();
    }
});


export const UpdateDesign = mutation({
    args: {
        id: v.id("designs"),
        name: v.optional(v.string()),
        width: v.optional(v.float64()),
        height: v.optional(v.float64()),
    },
    handler: async (ctx, args) => {
        const updates = {};

        if (args.name !== undefined) updates.name = args.name;
        if (args.width !== undefined) updates.width = args.width;
        if (args.height !== undefined) updates.height = args.height;

        await ctx.db.patch(args.id, updates);
        return { success: true };
    },
});


export const DeleteDesign = mutation({
    args: {
        id: v.id("designs"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

export const GetTemplates = query({
    args: {},
    handler: async (ctx) => {
        const result = await ctx.db
            .query("designs")
            .filter((q) => q.eq(q.field("type"), "template"))
            .collect();
        return result;
    },
});

export const CloneDesign = mutation({
    args: {
        sourceId: v.id("designs"),
        uid: v.id("users"),
    },
    handler: async (ctx, args) => {
        const source = await ctx.db.get(args.sourceId);

        if (!source) throw new Error("Template not found");

        const newId = await ctx.db.insert("designs", {
            name: source.name + " (Copy)",
            width: source.width,
            height: source.height,
            uid: args.uid,
            type: "user",
            jsonTemplate: source.jsonTemplate || null,
            imagePreview: source.imagePreview || null,
        });

        return newId;
    },
});

export const UpdateDesignName = mutation({
    args: {
        id: v.id("designs"),
        name: v.string()
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { name: args.name });
    }
});
