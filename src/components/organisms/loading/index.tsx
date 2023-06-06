import React, {useState} from 'react';
import {Spin} from 'antd';

export default function Loadind() {
	const [loading, setLoading] = useState(true);
	return (
		<div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<Spin spinning={loading} size="large" tip="Loading..."/>
		</div>
	);
}
