import React, { useEffect, useState } from 'react';
import { Layout, Flex, Row, Col, Divider, Spin, message } from 'antd';
import Timer from './Timer';
import WorldClock from './WorldClock';
import { LoadingOutlined } from '@ant-design/icons';
import { createTimer, fetchTimerHistory, generateSessionId, syncTimer, removeTimer } from './utils';
const { Header, Content } = Layout;
const headerStyle = {
	height: 64,
	paddingInline: 48,
	lineHeight: '64px',
};

const layoutStyle = {
	overflow: 'hidden',
	height: '100vh',
};
const App = () => {
	const [loader, setLoader] = useState(true);
	const [messageApi, contextHolder] = message.useMessage();
	const [timers, setTimers] = useState([]);
	const fetchHistory = async (sessionId) => {
		const resp = await fetchTimerHistory(sessionId);
		if (resp.error) {
			messageApi.open({
				type: 'error',
				content: resp.message,
			});
		} else {
			setTimers(resp.data);
			setLoader(false);
		}
	};

	const createNewTimer = async (data) => {
		const sessionId = localStorage.getItem('sessionId');
		const resp = await createTimer({ ...data, sessionId });
		if (resp.error) {
			messageApi.open({
				type: 'error',
				content: resp.message,
			});
		} else {
			setTimers(resp.data);
			setLoader(false);
		}
	};

  const updateTimer = async (data) => {
		const sessionId = localStorage.getItem('sessionId');
		const resp = await syncTimer({ ...data, sessionId });
		if (resp.error) {
			messageApi.open({
				type: 'error',
				content: resp.message,
			});
		}
	};

  const deleteTimer = async(data)=>{
		const resp = await removeTimer({ ...data });
		if (resp.error) {
			messageApi.open({
				type: 'error',
				content: resp.message,
			});
		}
  }

	useEffect(() => {
		const sessionId = localStorage.getItem('sessionId');
		if (sessionId && loader) {
			fetchHistory(sessionId);
		} else {
			(async () => {
				const sessionId = await generateSessionId();
				localStorage.setItem('sessionId', sessionId);
				setLoader(false);
			})();
		}
	}, [timers, loader]);
  

	return (
		<Flex gap='middle' wrap='wrap'>
			{contextHolder}
			<Layout style={layoutStyle}>
				<Header style={headerStyle}>Header</Header>
				<Content>
					{loader ? (
						<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
					) : (
						<Row>
							<Col span={8}>
								<WorldClock />
								<Divider type='vertical' />
							</Col>
							<Col span={16}>
								<Timer deleteTimer={deleteTimer} createNewTimer={createNewTimer} timers={timers} setTimers={(t) => setTimers(t)} updateTimer={updateTimer} />
							</Col>
						</Row>
					)}
				</Content>
			</Layout>
		</Flex>
	);
};
export default App;
