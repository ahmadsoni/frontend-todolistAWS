import Head from 'next/head';

import Navbar from '@/components/organisms/navbar';
import Content from '@/components/organisms/content';


export default function Home() {
	 
	return (
		<>
			<Head>
				<title>Todo List AWS + React + Nest JS</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				<Content />
			</div>
		</>
	);
}
