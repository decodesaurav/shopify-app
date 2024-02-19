import {Layout,
		Page,
		LegacyCard,
		TextField,
		RadioButton,
		OptionList,
		Link
} from '@shopify/polaris';
import {React,useState, useCallback} from 'react';
import { useApiCall } from '../../hooks/apiUtils';
import { useTranslation } from 'react-i18next';
import {CodeComponent } from '../../components/create-discount/CodeComponent';
import AdvancedSetting from '../../components/create-discount/AdvancedSetting';
import AdvancedCodeComponent from '../../components/create-discount/AdvancedCodeComponent';
import TitleComponent from '../../components/create-discount/DiscountDetails';
import SummaryComponent from '../../components/create-discount/SummaryComponent';
import { SelectDiscount } from '../../components/create-discount/AutoComplete';

export default function CreateDiscount() {
	const {t} = useTranslation();
	const [value, setValue] = useState('random');
	const [textErrorFromChild, setTextErrorFromChild] = useState(true);
	const [textFieldValuePrefixParent, setTextFieldValuePrefix] = useState(true);
  	const [textFieldValueSuffixParent, setTextFieldValueSuffix] = useState(true);
	const [numberOfCode, setNumberOfCode] = useState(100);
	const [numberOfCodeDiscount, setNumberOfCodeDiscount] = useState(1);
	const [textFieldValuePattern, setTextFieldValuePattern] = useState('');
	const [advancedCheckValue, setAdvancedValue] = useState('');
	const [modalValue, setModalValueActive] = useState(false);
	const [priorityOfDiscountCode, setPriorityOfDiscountCode ] = useState('normal');
	const [selectedOptionsFromSelect, setSelectedOptionsFromSelect] = useState(true);
	const [selectedLabel, setSelectedLabel] = useState(1);


	const radioChange = useCallback((_, newValue) => setValue(newValue), []);
	const handleDiscountCodeChange = useCallback((newValue) =>{
	const validValue = Math.min(1000, Math.max(1, newValue));
		setNumberOfCode(validValue);
	}, []);
	const handleAdvancedRadioChange = useCallback((_, selected) => setAdvancedValue(selected), []);
	const handleFieldValuePattern = useCallback((newValue) => setTextFieldValuePattern(newValue) , []);
	const popupHandler = useCallback(() => setModalValueActive((active) => !active), []);

	const handleSelectionChange = (selectedOptions) => {
		setSelectedOptionsFromSelect(selectedOptions);
	};

	const handleLabelChange = (selectedLabel) => {
		setSelectedLabel(selectedLabel);
	}
	const handlePrefixChange = (newValue) => {
		console.log(newValue);
		setTextFieldValuePrefix(newValue);
	};
	
	const handleSuffixChange = (newValue) => {
		setTextFieldValueSuffix(newValue);
	};

	const setPriorityQueue = (newValue) => {
		setPriorityOfDiscountCode(newValue);
	}

	const handleTextErrorChange = (error) => {
		setTextErrorFromChild(error);
	}
	const makeApiCall = useApiCall();

	const handleGenerateDiscountCodes = async () => {
		const data = {
			value,
			textFieldValuePrefixParent,
			textFieldValueSuffixParent,
			numberOfCode,
			numberOfCodeDiscount,
			textFieldValuePattern,
			advancedCheckValue,
			priorityOfDiscountCode,
			textErrorFromChild,
			selectedOptionsFromSelect,
			selectedLabel
		}
		console.log(data);
		const { data: responseData, error } = await makeApiCall('/api/generate-discount-codes', 'POST', data);

		if (error) {
			console.log('Error: ', error);
		} else {
			console.log(responseData);
		}
	};

	return (
		<Page
			backAction={{content: 'Products', url: '/'}}
			title={t("CreateDiscount.discount_title")}
			primaryAction={{
				content : t("generate_discount_codes"),
				onAction: handleGenerateDiscountCodes,
				disabled: (textFieldValuePrefixParent === true || textFieldValueSuffixParent === true ) || ( textErrorFromChild || !selectedOptionsFromSelect || (advancedCheckValue.length > 0 &&  textFieldValuePattern.length === 0)  )
			}}			
		>
		<Layout>
			<Layout.Section>
				<LegacyCard title="Discount details" sectioned>
					<TitleComponent
						errorMessage = {handleTextErrorChange}
					/>
					<SelectDiscount
						onSelectionChange={handleSelectionChange}
						labelValue={handleLabelChange} 
					/>
					<div style={{ marginTop: '16px' }}>
						<Link url="https://help.shopify.com/manual">Create New Discount</Link>
					</div>
				</LegacyCard>
				<LegacyCard title="Codes" sectioned>
					<div style={{ marginBottom: '16px' }}>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<RadioButton
								label="Generate Random Codes"
								checked={value === 'random'}
								id="random"
								name="random"
								onChange={radioChange}
							/>
							{/* <RadioButton
								label="Import Existing Codes"
								id="import"
								name="import"
								checked={value === 'import'}
								onChange={radioChange}
							/> */}
						</div>
					</div>
					<div>
						<Layout>
							<Layout.Section>
								<TextField
								label={t("CreateDiscount.number_of_codes_to_generate")}
								type="number"
								value={numberOfCode}
								onChange={handleDiscountCodeChange}
								autoComplete="off"
								/>
							</Layout.Section>
							{ ! advancedCheckValue.includes('advanced_pattern') ? (
								<CodeComponent
									numberOfCodeDiscount={numberOfCodeDiscount}
									setNumberOfCodeDiscount={setNumberOfCodeDiscount}
									onPrefixChange = {handlePrefixChange}
									onSuffixChange = {handleSuffixChange}
								/>
								) : (
									<AdvancedCodeComponent
										textFieldValuePattern={textFieldValuePattern}
										handleFieldValuePattern={handleFieldValuePattern}
										popupHandler={popupHandler}
										modalValue={modalValue}
									/>
								)
							}
						</Layout>
						<div style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }}>
							<OptionList
								onChange={(selected) =>{ 
									handleAdvancedRadioChange(null,selected)
									if (!selected.includes('advanced_pattern')) {
										setTextFieldValuePrefix(true);
										setTextFieldValueSuffix(true);
									}
								}}
								options={[
									{value: 'advanced_pattern', label: t("CreateDiscount.use_advanced_pattern")},
								]}
								selected={advancedCheckValue}
								allowMultiple
							/>
						</div>
					</div>
				</LegacyCard>

				{/* <LegacyCard sectioned>
					<Layout>
						<Layout.Section>
							<AdvancedSetting
								checkPriority = {setPriorityQueue}
							/>
						</Layout.Section>
					</Layout>
				</LegacyCard> */}

				<div style={{marginBottom:'60px'}} ></div>
			</Layout.Section>
			<Layout.Section variant="oneThird" secondary>
				<SummaryComponent
					numberOfCodeDiscount={numberOfCode}
					selectedOptionsFromSelect={selectedOptionsFromSelect}
				/>
			</Layout.Section>
			</Layout>
		</Page>
	);
}