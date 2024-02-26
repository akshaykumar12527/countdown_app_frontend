import React, { useState, useEffect } from 'react';
import { DeleteOutlined, PauseCircleOutlined, PlayCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Button, Divider, Form, Input, List, Progress, TimePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Title from 'antd/es/typography/Title';
dayjs.extend(customParseFormat);

function Timer(props) {
	const [form] = Form.useForm();
	const timeZones = { IST: 'India' };
	const [timeZone] = useState('IST');
	const [time, setTime] = useState(moment().format('hh:mm:ss'));
	// const [timers, setTimers] = useState([]);
	const [newTimer, setNewTimer] = useState('');

	const onChange = (_time, timeString) => {
		const hms = timeString; // your input string
		const a = hms.split(':'); // split it at the colons
		// minutes are worth 60 seconds. Hours are worth 60 minutes.
		const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];
		setNewTimer(seconds);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(moment().format('hh:mm:ss'));
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const removeTimer = (id) => {
		const updatedTimers = props.timers.filter((timer) => {
			if (timer._id == id) {
				props.deleteTimer({ ...timer, status: 'stopped' });
				return false;
			}
			return true;
		});
		// updatedTimers.splice(index, 1);
		props.setTimers(updatedTimers);
	};

	const pauseTimer = (id) => {
		const toggleStatus = { running: 'paused', paused: 'running' };
		const updatedTimers = props.timers.map((timer, i) => {
			timer = { ...timer, status: timer._id == id ? toggleStatus[timer.status] : timer.status };
			props.updateTimer(timer);
			return timer;
		});
		props.setTimers(updatedTimers);
	};

	const onFinish = (values) => {
		if (newTimer > 0) {
			const timer = {
				index: props.timers.length,
				timer: newTimer,
				initTimer: newTimer,
				name: values.name,
				status: 'running',
			};
			props.createNewTimer(timer);
			// props.setTimers([...props.timers, timer]);
			setNewTimer('');
			form.resetFields(['name', 'timer']);
		}
	};

	const onFinishFailed = (errorInfo) => {
		console.log('Failed:', errorInfo);
	};

	useEffect(() => {
		const interval = setInterval(() => {
			props.setTimers((prevTimers) => {
				console.log('prevTimers', prevTimers);
				return prevTimers.map((timer) => {
					timer = { ...timer, timer: timer.timer > 0 && timer.status == 'running' ? timer.timer - 1 : timer.timer };
					props.updateTimer(timer);
					return timer;
				});
			});
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div style={{ padding: 40 }}>
			<div className='timers'>
				<Title level={4}>Timer</Title>
				<Form form={form} name='customized_form_controls' layout='inline' onFinish={onFinish} onFinishFailed={onFinishFailed}>
					<Form.Item name='name' rules={[{ required: true, message: 'Please input valid name!' }]}>
						<Input style={{ width: 140 }} placeholder='Please input name' />
					</Form.Item>
					<Form.Item name='timer' rules={[{ required: true, message: 'Please input valid time!' }]}>
						<TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} />
					</Form.Item>
					<Form.Item>
						<Button type='primary' icon={<PlusCircleOutlined />} size={'lg'} htmlType='submit' />
					</Form.Item>
				</Form>
				<div className='timer-input'>
					{/* <input type='number' value={newTimer} onChange={(e) => setNewTimer(e.target.value)} /> */}
					{/* <TimePicker onChange={onChange} defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')} /> */}
					{/* <Button type="primary" icon={<PlusCircleOutlined />} size={'lg'}  onClick={addTimer}/> */}
					{/* <button onClick={addTimer}>
						<FiPlus />
					</button> */}
				</div>
				<List
					style={{ marginTop: 20, width: '50%' }}
					size='large'
					header={<div>Timers List</div>}
					bordered
					dataSource={props.timers}
					renderItem={(item) => (
						<List.Item>
							<div style={{ width: '100%' }}>
								<span level={5} style={{ fontSize: 16, fontWeight: 500 }}>
									{item.name} <span style={{fontSize: 11}}>({moment(item.createdAt).format('lll')})</span>
								</span>

								<Title level={3} style={{ marginTop: 5 }}>
									{moment.utc(item.timer * 1000).format('HH:mm:ss')}
								</Title>
								<div>
									{item.status != 'stopped' && (
										<Button type='primary' icon={item.status == 'running' ? <PauseCircleOutlined /> : <PlayCircleOutlined />} size='medium' onClick={() => pauseTimer(item._id)} />
									)}
									<Divider type='vertical' />
									<Button danger icon={<DeleteOutlined />} size='medium' onClick={() => removeTimer(item._id)} />
								</div>
								<Progress percent={(((item.initTimer - item.timer) / item.initTimer) * 100).toFixed(2)} />
							</div>
						</List.Item>
					)}
				/>
			</div>
		</div>
	);
}

export default Timer;
