import {useEffect, useState, Fragment} from 'react';
import Close from '@/images/close.svg';
import Checklist from '@/images/checklist.svg';
import Image from 'next/legacy/image';
import SelectDown from '@/images/select-down.svg';
import {Dialog, Transition, Listbox} from '@headlessui/react';
import * as base from '@/services/todoApi';
import {useMutation, type UseMutationResult, type MutationFunction, useQuery} from 'react-query';
import {type AddTodoList, type Todo, type SendIdProps} from '@/services/data-types';

const priority = [
	{name:'Pilih Priority', color: ''},
	{name: 'High', color: 'danger', prio: 'HIGH'},
	{name: 'Medium', color: 'warning', prio: 'MEDIUM'},
	{name: 'Low', color: 'success', prio: 'LOW'},
];
function addTodoList(): UseMutationResult<Todo[], Error, AddTodoList> {
	const mutationFn: MutationFunction<Todo[], AddTodoList> = async (input) => {
		const {activityId, title, priority} = input;
		const response = await base.addTodo(activityId, title, priority);
		return response.data;
	};

	return useMutation(mutationFn);
}

export default function ListEmpty(props: SendIdProps) {
	const {id} = props;
	const [selected, setSelected] = useState(priority[0]);
	const [isOpen, setIsOpen] = useState(false);
	const [allowAdd, setAllowAdd] = useState(true);
	const [todoTitle, setTodoTitle] = useState<string | undefined>('');
	const {refetch: refethActivity} = useQuery('todo-activity', {
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});
	const {refetch: refethListTodo} = useQuery('list-todo', {
		refetchOnWindowFocus: true,
		refetchOnMount: true,
	});


	const {mutate: addTodoListMutate, isLoading: addTodoListLoading, isError: addTodoListError, isSuccess: addTodoListSuccess} = addTodoList();
	const handleAddTodoList = () => {
		addTodoListMutate({activityId: id, title: todoTitle, priority: selected.prio, active: true});
		setTimeout(async () =>{
			await refethListTodo();
			await refethActivity();
			setIsOpen(false);
		}, 500);
	};

	const hadleChangeTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodoTitle(e.target.value);
	};

	useEffect(() => {
		if (selected.color !== '' && todoTitle !== '') {
			setAllowAdd(false);
		}
	}, [selected, todoTitle]);
	return (
		<>
			<div className='pt-6 flex justify-center items-center'>
				<button type='button' onClick={
					() => {
						setIsOpen(true); 
					} }>
					<Image
						className='flex mx-auto z-0'
						width={500}
						height={400}
						src='/png/todo-empty.png'
						alt=''
					/>
				</button>
			</div>
			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as="div" className="relative z-10" onClose={() => {
					setIsOpen(false);
					setAllowAdd(false);
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
									<div className='bg-white p-6  w-[830px] rounded-xl'>
										<div className='flex justify-between items-center px-8 py-6 border-b-2'>
											<h4 className="font-semibold text-xl">Tambah List Item</h4>
											<button type="button" className='cursor-pointer' onClick={() => {
												setIsOpen(false);
												setAllowAdd(false);
												
											}}>
												<Close />
											</button>
										</div>
										<div className='px-8 py-6'>
											<div className='mb-6'>
												<label className='font-semibold text-sm'>NAMA LIST ITEM</label>
												<input type="text" className={'w-full px-4 py-3 mt-2 border border-1 rounded focus:outline-4 outline-blue-200'} placeholder="Tambahkan nama item" data-cy="modal-add-name-input" onChange={hadleChangeTodo} />
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
											<button className={`border-2 rounded-full py-3 px-6  font-medium text-lg bg-primary text-white ml-auto w-[150px] ${allowAdd ? 'opacity-50 cursor-not-allowed' : 'opacity-100'} cursor-pointer`} disabled={allowAdd} onClick={handleAddTodoList}>Simpan</button>
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
