import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import {Button, notification} from 'antd';
import type {NotificationPlacement} from 'antd/es/notification/interface';
import type {SizeType} from 'antd/es/config-provider/SizeContext';
import AddTodo from '../../molecules/addTodo';
import CardTodo from '../../molecules/cardTodo';
import * as api from '@/services/activityApi';
import {useMutation, type UseMutationResult, type MutationFunction, useQuery, QueryClient} from 'react-query';
import {type Activity, type AddActivityForm, type CardActivity} from '@/services/data-types';


function useAddActivity(): UseMutationResult<Activity[], Error, AddActivityForm> {
	const queryClient = new QueryClient();
	const mutationFn: MutationFunction<Activity[], AddActivityForm> = async (input) => {
		const {title} = input;
		const response = await api.addActivity(title);
		const {data} = response;
		return data;
	};


	 return useMutation(mutationFn);
}

export default function Content() {
	 const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: Infinity,
			},
		},
	});
	const [info, contextHolder] = notification.useNotification();
	const [size, setSize] = useState<SizeType>('large');
	
	const {mutate, isLoading: addActivityLoading, isError: addActivityError, isSuccess: addActivitySuccess} = useAddActivity();
	const {data, isLoading: getActivityLoading, isError: getActivityError, isSuccess: getActivitySuccess, refetch: getActivityRefetch} = useQuery('todo-apps', api.getActivity, {
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});
	console.log('ini data', data);
	const addTodoList = async () => {
		 mutate({title: 'New Activity'});
	};

	const notificationSucces = (placement: NotificationPlacement) => {
		info.success({
			message: 'Data Berhasil Di Tambah',
			description:'Silahkan Membuat Todo List Kegiatan',
			placement,
		});
	};

	const notificationError = (placement: NotificationPlacement) => {
		info.error({
			message: 'Data Tidak Berhasil Di tambah',
			description:'Silahkan coba lagi',
			placement,
		});
	};

	const handleActivityUpdate = async () => {
		if (addActivitySuccess) {
			await getActivityRefetch();
			notificationSucces('topRight');
		}

		if (addActivityError) {
			notificationError('topRight');
		}
	};

	useEffect(() => {
		void handleActivityUpdate();
	}, [addActivitySuccess, addActivityError]);

	const invalidateQueries = async () => {
		await queryClient.invalidateQueries('list-todo');
		await queryClient.invalidateQueries('todo-activity');
		console.log('yess masuk');
	};

	useEffect(() => {
		void invalidateQueries();
		void getActivityRefetch();
	}, []);

	console.log(Error);
	return (
		<main className='bg-light grow'>
			{contextHolder}
			<div className="container mx-auto">
				<div className='flex justify-between mb-6 mt-10'>
					<h1 className="text-4xl font-bold">Activity</h1>
					<Button className='bg-primary flex items-center justify-center' type="primary" shape="round" size={size} disabled={addActivityLoading} onClick={addTodoList} loading={addActivityLoading}>
						{addActivityLoading ? undefined : <PlusOutlined className="mr-2" />}			
						<span> {addActivityLoading ? 'Loading..' : 'Tambah'}</span>
					</Button>
				</div>
				<div className='pb-15 pt-10'>
					{data?.data && data.data.length <= 0 ? <AddTodo /> : <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-4'>
						{data?.data.map((data: CardActivity) => (
							<div key={data.id} className='mx-auto'>
								<CardTodo key={data.id} title={data.title} createdAt={data.createdAt} id={data.id}/>
							</div>
						))}
					</div>}
				</div>
			</div>
		</main>
	);
}
