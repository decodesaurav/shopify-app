import {
	TextField,
	LegacyCard,
	Link
} from '@shopify/polaris';
import {React, useCallback, useState} from 'react';
import useValidation from '../../hooks/discount-code/useValidation';


export default function TitleComponent({errorMessage}){
	const { validateTitle,handleTextChange, titleError, validateError } = useValidation();
	const [textTitle, setTextTitle] = useState('');
	const [textError, setTextError] = useState('');


	const handleFieldChange = useCallback((newValue, setFieldText, setTitleError, errorMessage) => {
		setFieldText(newValue);
		handleTextChange(newValue);
		validateTitle(newValue, setTitleError);
		errorMessage(validateError(newValue));
	}, [handleTextChange, validateTitle]);

	return (
		<>
			<div style={{ marginBottom: '16px' }}>
				<TextField
					value={textTitle}
					onChange={(newValue) => handleFieldChange(newValue, setTextTitle, setTextError, errorMessage)}
					label="Title"
					type="title"
					placeholder="Example: Black Friday 2023"
				/>
				{ textError && <div style={{ color: 'red' }}>{textError}</div> }
			</div>
		</>
	);
}