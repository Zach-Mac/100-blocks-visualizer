export interface Activity {
	id: string
	name: string
	color: string
}
export interface Block {
	activityId: string | null
	startTime: string
	endTime: string
}
