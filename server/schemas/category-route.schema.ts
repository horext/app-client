import { z } from "zod";
import { scheduleCategoryCodeSchema } from "./schedule.schema";

export const categoryRouteSchema = z.object({
    categoryCode: scheduleCategoryCodeSchema,
})