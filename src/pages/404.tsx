import React from 'react';
import {Button, Result} from 'antd';
import Link from 'next/link';
export default function Custom404() {
	return (
		 <Result
			status="404"
			title="404"
			subTitle="Sorry, the page you visited does not exist."
			extra={
				<Link href='/'>
					<Button type="primary" className='bg-primary'>Back Home</Button>
				</Link>
			}
		/>
	);
}
