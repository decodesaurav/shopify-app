
import {Layout,
	TextField,
	LegacyCard,
	Link
} from '@shopify/polaris';
import {React,useState, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import useValidation from '../../hooks/discount-code/useValidation';


export function CodeComponent({numberOfCodeDiscount, setNumberOfCodeDiscount}) {
	const {t} = useTranslation();
	const { handleTextChange, validateTitle } = useValidation();
	const [textFieldValuePrefix, setTextFieldValuePrefix] = useState('');
	const [textFieldValueSuffix, setTextFieldValueSuffix] = useState('');
	const [titleErrorPrefix, setTitleErrorPrefix] = useState('');
	const [titleErrorSuffix, setTitleErrorSuffix] = useState('');

	const handleDiscountCodeChange = useCallback((newValue) =>{
		const validValue = Math.min(1000,Math.max(1,newValue));
		setNumberOfCodeDiscount(validValue);
	}, []);

	const handleFieldChange = useCallback((newValue, setFieldText, setTitleError) => {
		setFieldText(newValue);
		handleTextChange(newValue);
		validateTitle(newValue, setTitleError);
	  }, [handleTextChange, validateTitle]);


	return(
		<>
			<Layout.Section>
				<TextField
					label="Prefix"
					type="text"
					placeholder='Example: GF (leave empty space for no prefix)'
					value={textFieldValuePrefix}
					onChange={(newValue) => handleFieldChange(newValue, setTextFieldValuePrefix, setTitleErrorPrefix)}
					helpText={`The code generated will be: ${textFieldValuePrefix}-JUPGRAMM-${textFieldValueSuffix}`}
					autoComplete="email"
				/>
				{ titleErrorPrefix && <div style={{ color: 'red' }}>{titleErrorPrefix}</div> }
			</Layout.Section>
			<Layout.Section>
				<TextField
					label={t("CreateDiscount.number_of_random_letter")}
					type="number"
					value={numberOfCodeDiscount}
					onChange={handleDiscountCodeChange}
					autoComplete="off"
				/>
			</Layout.Section>
			<Layout.Section>
				<TextField
					label="Suffix"
					type="text"
					placeholder='Example: 15OFF (leave empty space for no prefix)'
					value={textFieldValueSuffix}
					onChange={(newValue) => handleFieldChange(newValue, setTextFieldValueSuffix, setTitleErrorSuffix)}
					helpText={`The code generated will be: ${textFieldValuePrefix}-JUPGRAMM-${textFieldValueSuffix}`}
					/>
					{ titleErrorSuffix && <div style={{ color: 'red' }}>{titleErrorSuffix}</div> }
			</Layout.Section>
		</>
	);
}