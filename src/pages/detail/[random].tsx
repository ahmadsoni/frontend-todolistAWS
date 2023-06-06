import React, {useEffect, useCallback, useState} from 'react';
import Navbar from '@/components/organisms/navbar';
import Loading from '@/components/organisms/loading';
import ContentActivity from '@/components/organisms/contentActivity';
import ListEmpty from '@/components/molecules/listEmpty';
import ListTodo from '@/components/molecules/listTodo';
import * as api from '@/services/activityApi';
import * as base from '@/services/todoApi';
import {type CardActivity, type GetStaticProps, type GetIdProps} from '@/services/data-types';
import {useQuery, QueryClient} from 'react-query';

export default function detailTodoList(random: GetIdProps) {
	const queryClient = new QueryClient();
	const dataId = random.random;
	const id  = parseInt(dataId, 10);
	
	const {data:todoData, isLoading: todoIsLoading} = useQuery(
		'list-todo',
		async () => {
			const response = await base.getTodo(id);
			return response.data;
		},
		{
			refetchOnWindowFocus: true,
			refetchOnMount: true,
		},
	);

	const {data:activityData, isLoading: activityIsLoading} = useQuery(
		'todo-activity',
		async (): Promise<CardActivity> => {
			const response = await api.getOneActivity(id);
			return response.data;
		},
		{
			refetchOnWindowFocus: true,
			refetchOnMount: true,
		},
	);

	return (
		<>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<main className='bg-light grow'>
					<div className="container mx-auto">				
						{todoIsLoading && activityIsLoading ? (
							<Loading />
						) : (
							<div>
								<ContentActivity id={id} title={activityData?.title}/>
								{todoData && todoData.length <= 0 ? (
									<ListEmpty id={id}/>
								) : (
									<ListTodo id={id} />
								)}
							</div>
						)}
					</div>
				</main>
			</div>
		</>
	);
}

export async function getStaticPaths() {
	const response = await api.getActivity();
	const paths = response.data.map((activity: CardActivity) => ({
		params: {random: activity.id.toString()},
	}));
	return {
		paths,
		fallback: true,
	};
}

export async function getStaticProps({params}: GetStaticProps) {
	const {random} = params;
	const dataGetTodo = await base.getTodo(parseInt(random, 10));
	const todoData = dataGetTodo.data;
	const dataActivity = await api.getOneActivity(parseInt(random, 10));
	const activityData = dataActivity.data;
	return {
		props: {
			random,
			todoData,
			activityData,
		},
	};
}



