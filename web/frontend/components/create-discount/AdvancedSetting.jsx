import {React,useState, useCallback} from 'react';
import { Link,
		Select,
		Banner,
		List
	} from '@shopify/polaris';

const AdvancedSetting = () => {
  const [advancedSetting, setAdvancedSetting] = useState(false);
  const [selected, setSelected] = useState('today');

  const toggleAdvancedSetting = () => {
    setAdvancedSetting(!advancedSetting);
  };
  const handleSelectChange = useCallback(
    (value) => setSelected(value),
    [],
  );

  const options = [
    {label: 'Urgent', value: 'urgent'},
    {label: 'High', value: 'high'},
    {label: 'Normal', value: 'normal'},
	{label: 'Low', value: 'low'},
    {label: 'Can Wait', value: 'can-wait'},
  ];


  return (
    <>
      <Link onClick={toggleAdvancedSetting}>Advanced Setting</Link>

      {advancedSetting && (
			<div style={{ marginTop: '10px', marginBottom: '20px' }}>
				<Select
					label="Priority"
					options={options}
					onChange={handleSelectChange}
					value={selected}
				/>
			<div style={{ marginTop: '10px', marginBottom: '20px' }}>
				<Banner
					tone="info"
				>			
					Learn more about{' '}
					<Link url="https://help.shopify.com/manual">Advanced Setting</Link>
				</Banner>
			</div>
        </div>
      )}
    </>
  );
};

export default AdvancedSetting;
