import React, { useState } from 'react';
import { LegacyCard, Button } from '@shopify/polaris';
import { useRandomTextGenerator } from '../../hooks/discount-code/generateRandomNumbers';

const DiscountCodePreview = ( numberOfCode, advancedPattern, isAdvancedChecked ) => {
	console.log(numberOfCode);
	var patternMatch = numberOfCode['advancedPattern'];
	const extractedNumber = patternMatch.match(/\d+/);
	const advancedNumber = extractedNumber?.[0] ?? '0';

	var checkAdvancedSelection = numberOfCode['isAdvancedChecked'].toString();
	console.log(checkAdvancedSelection, advancedNumber)
	const { randomText } = (checkAdvancedSelection === 'advanced_pattern') ? useRandomTextGenerator(advancedNumber) : useRandomTextGenerator(numberOfCode['numberOfCodeDiscount']);

	return (
		<>
			<div id='discountPreview' style={{marginTop: '20px', overflowX: 'auto'}}>
				<LegacyCard title="Preview" sectioned>
				<p style={{ wordBreak: 'break-all' }}>
        			The generated code will look like: <strong>XXX-{randomText}-YYY</strong>
      			</p>
	  	 		</LegacyCard>
			</div>
		</>
	);
};

export default DiscountCodePreview;