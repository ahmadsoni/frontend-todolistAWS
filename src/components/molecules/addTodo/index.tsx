import React from 'react';
import Image from 'next/legacy/image';
import Plus from '@/images/plus.svg';
import {Typography} from 'antd';

const {Title} = Typography;
export default function AddTodo() {
	return (
		<div className='grid gap-8 grid-cols-2'>
			<div className="p-6">
				<div className='flex justify-end'>
					<Image
						className='w-2/2'
						width={500}
						height={500}
						src='/png/page-1.png'
						alt=''
					/>
				</div>
			</div>
			<div className="p-6">
				<div className="columns-1">
					<button className='w-1/2 h-[208px] border-8 shadow-lg border-slate-300/50 rounded-lg pb-8 bg-transparent py-8 px-8 hover:bg-primary hover:border-transparent hover:translate-y-2 hover:scale-[105%] group hover:transition-transform transition duration-150 ease-out hover:ease-in bloc'>
						<div className='bg-primary rounded-full w-[120px] h-[120px] mx-auto group-hover:bg-white flex shadow-lg'>
							<Plus className=' py-8 px-8 w-full plus'/>
						</div>
					</button>
					<Title level={3} className="pt-10 px-8" type="secondary">Buat activity pertamamu</Title>
				</div>
			</div>
		</div>
	);
}
