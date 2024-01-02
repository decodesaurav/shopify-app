
import {React} from 'react';
import { LegacyCard } from '@shopify/polaris';
import { useTranslation } from 'react-i18next';

export default function SummaryComponent(props) {
	return(
		<LegacyCard title="Summary" sectioned>
			<div>
				<li style={{marginBottom : '10px'}} >{props.numberOfCodeDiscount} code will be generated.</li>
				<li style={{marginBottom : '10px'}} > The generated code will be visible under Discount Title: <strong>'{props.selectedOptionsFromSelect}'</strong></li>
			</div>
		</LegacyCard>
	);
};