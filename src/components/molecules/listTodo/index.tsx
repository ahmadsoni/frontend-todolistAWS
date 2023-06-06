import {Fragment, useEffect, useState, useCallback} from 'react';
import {Checkbox} from 'antd';
import type {CheckboxChangeEvent} from 'antd/es/checkbox';
import EditButton from '@/images/edit-button.svg';
import Trash from '@/images/trash.svg';
import {type UpdateCheckTodoProps, type UpdateActivityProps, type CardActivity, type GetStaticProps, type Todo, type SendIdProps} from '@/services/data-types';
import * as base from '@/services/todoApi';
import {useMutation, type UseMutationResult, type MutationFunction, useQuery, QueryClient} from 'react-query';
import {Dialog, Transition, Listbox} from '@headlessui/react';
import Warning from '@/images/warning.svg';
import InformationSuccess from '@/images/information-success.svg';
import InformationFailed from '@/images/information-failed.svg';
import Close from '@/images/close.svg';
import Checklist from '@/images/checklist.svg';
import SelectDown from '@/images/select-down.svg';

const queryClient = new QueryClient();

function checkColor(color: string) {
	console.log('ini color', color);
	switch (color) {
		case 'HIGH':
			return 'danger';
		case 'MEDIUM':
			return 'warning';
		case 'LOW':
			return 'success';
		default:
			return '';
	}
}

const handleCheckedDefault = (check: string) => {
	const checkNumber = Number(check);
	if (checkNumber === 0) {
		return true;
	}

	return false;
};

function updateCheckTodo(): UseMutationResult<Todo[], Error, UpdateCheckTodoProps> {
	const mutationFn: MutationFunction<Todo[], UpdateCheckTodoProps> = async (input) => {
		const {activityId, active, title} = input;
		const {data} = await base.updateCheckTodo(activityId, active, title);
		return data;
	};

	return useMutation(mutationFn, {
		async onSuccess() {
			await queryClient.invalidateQueries('list-todo');
		},
	});
}

function updateTodoListFetch(): UseMutationResult<Todo[], Error, UpdateActivityProps> {
	const mutationFn: MutationFunction<Todo[], UpdateActivityProps> = async (input) => {
		const {activityId, title, priority} = input;
		const {data} = await base.updateTodoList(activityId, title, priority);
		return data;
	};

	return useMutation(mutationFn, {
		async onSuccess() {
			await queryClient.invalidateQueries('list-todo');
		},
	});
}

function deleteTodoList(): UseMutationResult<Todo[], Error, string> {
	const mutationFn: MutationFunction<Todo[], string> = async (id) => {
		const {data} = await base.deleteTodoList(parseInt(id, 10));
		return data;
	};

	return useMutation(mutationFn, {
		async onSuccess() {
			await queryClient.invalidateQueries('list-todo');
		},
	});
}


const priority = [
	{name:'Pilih Priority', color: ''},
	{name: 'High', color: 'danger', prio: 'HIGH'},
	{name: 'Medium', color: 'warning', prio: 'MEDIUM'},
	{name: 'Low', color: 'success', prio: 'LOW'},
];
export default function ListTodo(props: SendIdProps) {
	const {id} = props;
	const [isOpen, setIsOpen] = useState(false);
	const [isOpen2, setIsOpen2] = useState(false);
	const [isOpen3, setIsOpen3] = useState(false);
	const [allowAdd, setAllowAdd] = useState(false);
	const [selected, setSelected] = useState(priority[0]);
	const [todoTitle, setTodoTitle] = useState<string | undefined>('');
	const [deleteTodoProps, setDeleteTodoProps ] = useState({
		id: '',
		title: '',
	});
	const [updateIdTodoList, setUpdateIdTodoList] = useState(0);
	const [edit, setEdit] = useState(false);
	const handleEditTodo = (title: string, priority: string, id: number) => {
		setUpdateIdTodoList(id);
		checkColorUpdate(priority);
		setTodoTitle(title);
		setIsOpen3(true);
	};

	function checkColorUpdate(color: string) {
		switch (color) {
			case 'HIGH':
				setSelected(priority[1]);
				break;
			case 'MEDIUM':
				setSelected(priority[2]);
				break;
			case 'LOW':
				setSelected(priority[3]);
				break;
			default:
				setSelected(priority[0]);
		}
	}

	const handleCheckTodo = ({activityId, active, title}: UpdateCheckTodoProps) => {
		updateCheckTodoMutate({activityId, active, title});
		setTimeout(async () => {
			await todoRefetch();
		}, 500);
	};

	const cancelModal = () => {
		setIsOpen(false);
	};

	const deleteModal = () => {
		setIsOpen(true);
	};

	const deleteAction = async () => {
		deleteTodoListMutate(deleteTodoProps.id);
	};

	const handleDeleteTodo = (id: string, title: string) => {
		setDeleteTodoProps({
			id,
			title,
		});
		deleteModal();
	};

	const hadleChangeTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodoTitle(e.target.value);
	};

	const handleAddTodoList = () => {
		updateTodoListMutate({activityId: updateIdTodoList, title: todoTitle, priority: selected.prio});
		setTimeout(async () =>{
			await todoRefetch();
			setIsOpen3(false);
			setSelected(priority[0]);
		}, 500);
	};

	const {mutate: updateCheckTodoMutate, isLoading: updateCheckTodoLoading, isError: updateCheckTodoError, isSuccess: updateCheckTodoSuccess} = updateCheckTodo();
	const {mutate: deleteTodoListMutate, isLoading: deleteTodoListLoading, isError: deleteTodoListError, isSuccess: deleteTodoListSuccess} = deleteTodoList();
	const {mutate: updateTodoListMutate, isLoading: updateTodoListLoading, isError: updateTodoListError, isSuccess: updateTodoListSuccess} = updateTodoListFetch();


	const {data:todoData, isLoading: todoIsLoading, isError: todoIsError, isSuccess: todoIsSuccess, refetch: todoRefetch} = useQuery<Todo []>(
		'list-todo', {
			refetchOnWindowFocus: true,
			refetchOnMount: true,
			staleTime: 2500,
		},
	);
	const deleteHandle = useCallback(() => {
		if (deleteTodoListError || deleteTodoListSuccess) {
			setIsOpen(false);
			setIsOpen2(true);
			setTimeout(async () => {
				await todoRefetch();
			}, 1500);
		}
	}, [deleteTodoListError, deleteTodoListSuccess]);

	useEffect(() => {
		deleteHandle();
	}, [deleteTodoListError, deleteTodoListSuccess]);

	useEffect(() => {
		if (todoTitle === '') {
			setAllowAdd(true);
		} else {
			setAllowAdd(false);
		}
	}, [todoTitle]);
	return (
		<>
			<div className='pt-6 pb-10 flex flex-col gap-3'>
				{todoData?.map((todo, todoIdx: number) => (
					<div className='p-6 h-20 bg-white rounded-xl shadow-lg flex items-center justify-between' key={todoIdx}>
						<div className='flex items-center gap-3'>
							<div className='w-fit'>
								<Checkbox  onChange={async () => {
									handleCheckTodo({activityId: todo.id, active: !todo.active, title: todo.title}); 
								}} checked={handleCheckedDefault(todo.active)} className='mr-2  md:mr-5 scale-150'/>
							</div>
							<div className='flex gap-4 items-center text-lg font-medium'>
								<div className={`w-4 h-4 rounded-full bg-${checkColor(todo.priority)}`}></div>
								<span className={` ${todo.active ? '' : 'text-secondary line-through'}`}>
									{todo.title}
								</span>
								<button onClick={()=>{
									handleEditTodo(todo.title, todo.priority, todo.id);
								}}>
									<EditButton />
								</button>
							</div>
						</div>
						<div>
							<div className='cursor-pointer'onClick={() => {
								handleDeleteTodo(todo.id.toString(), todo.title);
							}}>
								<Trash clasName="w-full" />
							</div>
						</div>
					</div>
				))}
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
									<div className='bg-white p-6 w-full sm:w-[497px] rounded-xl'>
										<Warning  className='mx-auto'/>
										<div className='py-10 text-lg text-center'>
                                            Apakah anda yakin menghapus activity
											<span className="font-bold"> &quot;{deleteTodoProps.title}&quot;?</span>
										</div>
										<div className="flex justify-center gap-6">
											<button type='button' className="inline-flex justify-center rounded-full border border-transparent bg-[#F4F4F4] px-10 py-4 text-base font-medium text-slate-600 hover:bg-[#faffff] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={cancelModal}>Batal</button>
											<button className="inline-flex justify-center rounded-full border border-transparent bg-[#ED4C5C] px-10 py-4 text-base font-medium text-white hover:bg-[#fc5e6e] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2" onClick={deleteAction} disabled={deleteTodoListLoading} >Hapus</button>
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
										{deleteTodoListSuccess ? <InformationSuccess /> : deleteTodoListError ? <InformationFailed /> : null}
										<span>
											<h2>Activity {deleteTodoListSuccess ? 'berhasil' : deleteTodoListError ? 'tidak berhasil' : null} dihapus</h2>
										</span>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
			<Transition appear show={isOpen3} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => {
					setIsOpen(false);
					setSelected(priority[0]);
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
									<div className='bg-white p-6 w-full sm:w-[830px] rounded-xl'>
										<div className='flex justify-between items-center px-8 py-6 border-b-2'>
											<h4 className="font-semibold text-xl">Tambah List Item</h4>
											<button type="button" className='cursor-pointer' onClick={() => {
												setIsOpen3(false);
												setSelected(priority[0]);
											}}>
												<Close />
											</button>
										</div>
										<div className='px-8 py-6'>
											<div className='mb-6'>
												<label className='font-semibold text-sm'>NAMA LIST ITEM</label>
												<input 
													type="text" 
													className={'w-full px-4 py-3 mt-2 border border-1 rounded focus:outline-4 outline-blue-200'} 
													placeholder="Tambahkan nama item" 
													onChange={hadleChangeTodo} 
													value={todoTitle} 
												/>
											</div>
											<div className='mb-6'>
												<label className='font-semibold text-sm'>PRIORITY</label>
												<Listbox value={selected} onChange={setSelected}>
													<div className="relative mt-1">
														<Listbox.Button className="relative cursor-default  p-3 outline outline-1 outline-slate-200 w-[207px] rounded flex justify-between items-center shadow-top">
															<div className='flex items-center gap-3'>
																<div className={`w-3 h-3 rounded-full bg-${selected.color}`}></div>
																<span className="block truncate">{selected.name}</span>
															</div>
															<span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
																<SelectDown />
															</span>
														</Listbox.Button>
														<Transition
															as={Fragment}
															leave="transition ease-in duration-100"
															leaveFrom="opacity-100"
															leaveTo="opacity-0"
														>
															<Listbox.Options className="absolute mt-1 w-[207px] overflow-auto rounded-md bg-white py-1 text-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-base">
																{priority.slice(1).map((priority, personIdx) => (
																	<Listbox.Option
																		key={personIdx}
																		className={({active, selected}) =>
																			`relative cursor-default select-none py-2 ${
																				active ? 'bg-blue-200' : 'text-gray-900'
																			} ${ selected ? 'bg-blue-200' : 'text-gray-900'}`
																		}
																		value={priority}
																	>
																		{({selected}) => (
																			<div className='relative flex justify-between items-center p-2'>
																				<div className='flex items-center gap-3'>
																					<div className={`w-3 h-3 rounded-full bg-${priority.color}`}></div>
																					<span
																						className={`block truncate ${
																							selected ? 'font-medium' : 'font-normal'
																						}`}
																					>
																						{priority.name}
																					</span>
																				</div>
																				{selected ? (
																					<div className=''>
																						<Checklist />
																					</div>
																				) : null}
																			</div>
																		)}
																	</Listbox.Option>
																))}
															</Listbox.Options>
														</Transition>
													</div>
												</Listbox>
											</div>
										</div>
										<div className='px-8 py-6 border-t-2 flex justify-end'>
											<button className={`border-2 rounded-full py-3 px-6 font-normal sm:font-medium text-lg bg-primary text-white ml-auto w-[130px] sm:w-[150px] ${allowAdd ? 'opacity-50 cursor-not-allowed' : 'opacity-100'} cursor-pointer`} disabled={allowAdd} onClick={handleAddTodoList}>Simpan</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
