import React, { useState } from 'react';
import { LegacyCard, Button } from '@shopify/polaris';
import { useRandomTextGenerator } from '../../hooks/discount-code/generateRandomNumbers';

const DiscountCodePreview = ( numberOfCode ) => {
	const { randomText} = useRandomTextGenerator(numberOfCode);

	return (
		<>
			<div id='discountPreview' style={{marginTop: '20px', overflowX: 'auto'}}>
				<LegacyCard title="Preview" sectioned>
				<p style={{ wordBreak: 'break-all' }}>
        			The generated code will look like: <strong>{randomText}</strong>
      			</p>
	  	 		</LegacyCard>
			</div>
		</>
	);
};

export default DiscountCodePreview;