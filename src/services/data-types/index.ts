export type Activity = {
	id: number;
	title: string;
	createdAt: string;
	updatedAt: string;
};

export type ActivityAdd = {
	createdAt: string;
	updatedAt: string;
	id: number;
	title: string;
	email: string;
};

export type ActivityAddUpdate = {
	status: string;
	message: string;
	data: ActivityAdd;
};
export type Todo = {
	id: number;
	activity_group_id: string;
	title: string;
	active: string;
	priority: string;
	createdAt: string;
	updatedAt: string;
};

export type UpdateTodo = {
	status: string;
	message: string;
	data: Todo;
};

export type AddActivityForm = {
	title: string;
};
export type UpdateActivityForm = {
	id: number;
	title?: string;
};

export type UpdateActivityProps = {
	activityId: number;
	title?: string;
	priority?: string;
};
export type UpdateCheckTodoProps = {
	activityId: number;
	title?: string;
	active: boolean;
};
export type CardActivity = {
	id: number;
	title: string;
	createdAt: string;
	updatedAt?: string;
};

export type GetStaticProps = {
	params: {
		random: string;
	};
};

export type GetIdProps = {
	random: string;
};

export type SendIdProps = {
	id: number;
};

export type ContentActivityProps = {
	id: number;
	title?: string;
};

export type AddTodoList = {
	activityId: number;
	title?: string;
	priority?: string;
	active: boolean;
};