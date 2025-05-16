import { z } from 'zod'

export const ActivitySchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string()
})
export type Activity = z.infer<typeof ActivitySchema>

export const BlockSchema = z.object({
	activityId: z.string().nullable()
})
export type Block = z.infer<typeof BlockSchema>
