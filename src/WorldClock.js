import React, { useEffect, useState } from 'react';
import { ClockCircleTwoTone } from '@ant-design/icons';
import { Flex, Select } from 'antd';
import moment from 'moment-timezone';
import Title from 'antd/es/typography/Title';

const WorldClock = () => {
  const timeZones = {
    'IST': 'Asia/Kolkata',
    'PST': 'America/Los_Angeles'
  }
	const [timezone, setTimezone] = useState('IST');
  const [currentTime, setCurrentTime] = useState(moment());
	const onChange = (value) => {
		console.log(`selected ${value}`);
		setTimezone(value);
	};
	const onSearch = (value) => {
		console.log('search:', value);
	};

  useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(moment());
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	// Filter `option.label` match the user type `input`
	const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
	return (
		<div style={{ padding: 40 }}>
			<Flex>
				<ClockCircleTwoTone style={{ fontSize: 30 }} />

				<Select
					showSearch
					placeholder='Select timezone'
					optionFilterProp='children'
					onChange={onChange}
					onSearch={onSearch}
					filterOption={filterOption}
					style={{ width: 200, marginLeft: 10 }}
          value={timezone}
					options={[
						{
							value: 'IST',
							label: 'Indian Standard Time',
						},
						{
							value: 'PST',
							label: 'Pacific Standard Time',
						},
					]}
				/>
			</Flex>
			<div>
				<img src='https://momentjs.com/static/img/world.png' style={{ width: 300, marginTop: 20, background: '#1777ff' }} />
				<div style={{marginTop: 20}}>
					<span>{timezone} time now</span>
					<Title level={3} style={{marginTop: 10, marginBottom: 2}}>{currentTime.tz(timeZones[timezone]).format('hh:mm:ss')}</Title>
          <span style={{fontSize: 16, marginTop: 2}}>{currentTime.tz(timeZones[timezone]).format('dddd, MMMM Do YYYY')}</span>
          <p style={{fontSize: 12, marginTop: 5, fontWeight: 600}}>{timeZones[timezone]}</p>
				</div>
			</div>
		</div>
	);
};

export default WorldClock;
