/* eslint-disable @typescript-eslint/naming-convention */
import axios, {type AxiosInstance, type AxiosResponse} from 'axios';
import {type Activity, type ActivityAddUpdate, type CardActivity} from './data-types';

const api: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

export const getActivity = async (): Promise<AxiosResponse<Activity[]>> => {
	const response: AxiosResponse<Activity[]> = await api.get('/activity');
	return response;
};

export const getOneActivity = async (id: number): Promise<AxiosResponse<CardActivity>> => {
	const response: AxiosResponse<CardActivity> = await api.get(`/activity/${id}`);
	return response;
};

export const addActivity = async (title: string): Promise<AxiosResponse<Activity[]>> => {
	const response: AxiosResponse<Activity[]> = await api.post('/activity', {
		title,
	});
	return response;
};

export const updateActivity = async (id: number, title?: string): Promise< AxiosResponse<Activity[]>> => {
	const response:   AxiosResponse<Activity[]> = await api.patch(`/activity/${id}`, {
		title,
	});
	return response;
};

export const deleteActivity = async (id: number): Promise<AxiosResponse<Activity[]>> => {
	const response:  AxiosResponse<Activity[]> = await api.delete(`/activity/${id}`);
	return response;
};