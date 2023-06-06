 
import {Fragment, useEffect, useState, useCallback} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {Card, Row} from 'antd';
import Trash from '@/images/trash.svg';
import Warning from '@/images/warning.svg';
import InformationSuccess from '@/images/information-success.svg';
import InformationFailed from '@/images/information-failed.svg';
import Link from 'next/link';
import {type CardActivity, type Activity} from '@/services/data-types';
import * as api from '@/services/activityApi';
import {useMutation, type UseMutationResult, type MutationFunction, useQuery, QueryClient} from 'react-query';

const queryClient = new QueryClient();
const useDeleteActivity = (id: number): UseMutationResult<Activity[], Error, number> => {
	const mutationFn: MutationFunction<Activity[], number> = async (id) => {
		const response = await api.deleteActivity(id);
		return response.data;
	};

	return useMutation(mutationFn, {
		async onSuccess() {
			await queryClient.invalidateQueries('todo-apps');
		},
	});
};

export default function CardTodo(props: CardActivity) {
	const {id, title, createdAt} = props;
	const date: Date = new Date(createdAt);
	const options: Intl.DateTimeFormatOptions = {day: 'numeric', month: 'long', year: 'numeric'};
	const formattedDate: string = date.toLocaleDateString('id-ID', options);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpen2, setIsOpen2] = useState(false);
	const {refetch} = useQuery('todo-apps', {
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});
	console.log('ini time', createdAt );
	const {mutate, isLoading: deleteActivityLoading, isError: deleteActivityError, isSuccess: deleteActivitySuccess} = useDeleteActivity(id);
	const deleteModal = () => {
		setIsOpen(true);
	};

	const cancelModal = () => {
		setIsOpen(false);
	};
	
	const deleteAction = async () => {
		mutate(id);
	};

	const deleteHandle = useCallback(() => {
		if (deleteActivityError || deleteActivitySuccess) {
			setIsOpen(false);
			setIsOpen2(true);
			setTimeout(async () => {
				await refetch();
			}, 1500);
		}
	}, [deleteActivityError, deleteActivitySuccess]);

	useEffect(() => {
		deleteHandle();
	}, [deleteActivityError, deleteActivitySuccess]);
	return (
		<div>
			<div className='bg-white shadow-lg rounded-xl h-56 p-4 flex flex-col justify-between w-[320px] sm:w-[230px] mt-4'>
				<Link href={`/detail/${id}`} className='grow group'>
					<h4  className="text-lg font-bold cursor-pointer pt-2 group-hover:text-primary">
						{title}
					</h4>
				</Link>
				<div className='flex justify-between'>
					<span className="text-secondary font-semibold text-base font-poppins">{formattedDate}</span>
					<div className='cursor-pointer flex items-center'>
						<Trash clasName="w-full" onClick={deleteModal}/>
					</div>
				</div>
			</div>
			 <Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => {
					setIsOpen(false);
				}}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="relative transform text-left shadow-xl transition-all w-fit my-auto opacity-100 translate-y-0 sm:scale-100">
									<div className='bg-white p-6 rounded-xl w-full sm:w-[497px]'>
										<Warning  className='mx-auto'/>
										<div className='py-10 text-lg text-center'>
                                            Apakah anda yakin menghapus activity
											<span className="font-bold"> &quot;{title}&quot;?</span>
										</div>
										<div className="flex justify-center gap-6">
											<button type='button' className="inline-flex justify-center rounded-full border border-transparent bg-[#F4F4F4] px-10 py-4 text-base font-medium text-slate-600 hover:bg-[#faffff] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={cancelModal}>Batal</button>
											<button className="inline-flex justify-center rounded-full border border-transparent bg-[#ED4C5C] px-10 py-4 text-base font-medium text-white hover:bg-[#fc5e6e] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={deleteAction} disabled={deleteActivityLoading} >Hapus</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
			 <Transition appear show={isOpen2} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => {
					setIsOpen2(false);
				}}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-black bg-opacity-25" />
					</Transition.Child>

					<div className="fixed inset-0 overflow-y-auto">
						<div className="flex min-h-full items-center justify-center p-4 text-center">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 scale-95"
								enterTo="opacity-100 scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 scale-100"
								leaveTo="opacity-0 scale-95"
							>
								<Dialog.Panel className="relative transform text-left shadow-xl transition-all w-fit my-auto opacity-100 translate-y-0 sm:scale-100">
									<div className='bg-white p-6 flex gap-4 items-center w-full sm:w-[497px] rounded-xl'>
										{deleteActivitySuccess ? <InformationSuccess /> : deleteActivityError ? <InformationFailed /> : null}
										<span>
											<h2>Activity {deleteActivitySuccess ? 'berhasil' : deleteActivityError ? 'tidak berhasil' : null} dihapus</h2>
										</span>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
			
		</div>
	);
}
