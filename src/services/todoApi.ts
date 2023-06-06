/* eslint-disable @typescript-eslint/naming-convention */
import axios, {type AxiosInstance, type AxiosResponse} from 'axios';
import {type UpdateTodo, type Todo} from './data-types';

const base: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const getTodo = async (activityId: number): Promise<AxiosResponse<Todo[]>> => {
	const response: AxiosResponse<Todo[]> = await base.get(`/todo/?activity_group_id=${activityId}`);
	return response;
};

export const updateCheckTodo = async (activityId: number, isActive: boolean, title?: string): Promise<AxiosResponse<Todo[]>> => {
	const response: AxiosResponse<Todo[]> = await base.patch(`/todo/${activityId}`, {
		active: isActive,
		title,
	});
	return response;
};

export const updateTodoList = async (activityId: number, title?: string, priority?: string): Promise<AxiosResponse<Todo[]>> => {
	const response: AxiosResponse<Todo[]> = await base.patch(`/todo/${activityId}`, {
		title,
		priority,
	});
	return response;
};

export const addTodo = async (activityId: number, title?: string, priority?: string): Promise<AxiosResponse<Todo[]>>  => {
	const response: AxiosResponse<Todo[]> = await base.post('/todo', {
		activity_group_id: activityId,
		title,
		priority,
		active: true,
	});
	return response;
};



export const deleteTodoList = async (activityId: number): Promise<AxiosResponse<Todo[]>> => {
	const response: AxiosResponse<Todo[]> = await base.delete(`/todo/${activityId}`);
	return response;
};