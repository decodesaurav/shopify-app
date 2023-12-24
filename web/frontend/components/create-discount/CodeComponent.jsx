
import {Layout,
	TextField,
	LegacyCard,
	Link
} from '@shopify/polaris';
import {React,useState, useCallback} from 'react';
import { useTranslation } from 'react-i18next';


export function CodeComponent() {
	const {t} = useTranslation();
	const [numberOfCode, setNumberOfCode] = useState('1');
	const [textFieldValuePrefix, setTextFieldValuePrefix] = useState('');


	const handleDiscountCodeChange = useCallback((newValue) =>{
	const validValue = Math.max(1,newValue);
		setNumberOfCode(validValue);
	}, []);
	const handlePrefixValue = useCallback((newValue) => setTextFieldValuePrefix(newValue) , []);

	return(
		<>
			<Layout.Section>
				<TextField
					label="Prefix"
					type="text"
					placeholder='Example: GF (leave empty space for no prefix)'
					value={textFieldValuePrefix}
					onChange={handlePrefixValue}
					helpText="The code generated will be: GF-JUPGRAMM-20OFF"
					autoComplete="email"
				/>
			</Layout.Section>
			<Layout.Section>
				<TextField
					label={t("CreateDiscount.number_of_random_letter")}
					type="number"
					value={numberOfCode}
					onChange={handleDiscountCodeChange}
					autoComplete="off"
				/>
			</Layout.Section>
			<Layout.Section>
				<TextField
					label="Suffix"
					type="text"
					placeholder='Example: 15OFF (leave empty space for no prefix)'
					value={textFieldValuePrefix}
					onChange={handlePrefixValue}
					helpText="The code generated will be: GF-JUPGRAMM-15OFF"
				/>
			</Layout.Section>
		</>
	);
}