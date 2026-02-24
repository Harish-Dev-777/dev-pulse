import { GenericQueryCtx, GenericMutationCtx, GenericActionCtx } from "convex/server";
import { DataModel } from "./dataModel";

export type QueryCtx = GenericQueryCtx<DataModel>;
export type MutationCtx = GenericMutationCtx<DataModel>;
export type ActionCtx = GenericActionCtx<DataModel>;

export const query: any;
export const mutation: any;
export const action: any;
export const internalQuery: any;
export const internalMutation: any;
export const internalAction: any;
