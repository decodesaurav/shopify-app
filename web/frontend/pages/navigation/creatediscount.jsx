import {Layout,
		Page,
		LegacyCard,
		TextField,
		RadioButton,
		OptionList,
		Link,
		Spinner,
		Banner
} from '@shopify/polaris';
import {React,useState, useCallback} from 'react';
import { useApiCall } from '../../hooks/apiUtils';
import { useTranslation } from 'react-i18next';
import {CodeComponent } from '../../components/create-discount/CodeComponent';
import AdvancedCodeComponent from '../../components/create-discount/AdvancedCodeComponent';
import TitleComponent from '../../components/create-discount/DiscountDetails';
import SummaryComponent from '../../components/create-discount/SummaryComponent';
import { SelectDiscount } from '../../components/create-discount/AutoComplete';
import {useNavigate} from 'react-router-dom';
import { Toast } from '@shopify/app-bridge-react';
import { isEmpty } from 'lodash';
import { useAppQuery } from '../../hooks';

export default function CreateDiscount() {
	const {t} = useTranslation();
	const [value, setValue] = useState('random');
	const [textErrorFromChild, setTextErrorFromChild] = useState(true);
	const [textFieldValuePrefixParent, setTextFieldValuePrefix] = useState(false);
  	const [textFieldValueSuffixParent, setTextFieldValueSuffix] = useState(false);
	const [numberOfCode, setNumberOfCode] = useState();
	const [numberOfCodeDiscount, setNumberOfCodeDiscount] = useState(1);
	const [textFieldValuePattern, setTextFieldValuePattern] = useState('');
	const [advancedCheckValue, setAdvancedValue] = useState('');
	const [modalValue, setModalValueActive] = useState(false);
	const [priorityOfDiscountCode, setPriorityOfDiscountCode ] = useState('normal');
	const [selectedOptionsFromSelect, setSelectedOptionsFromSelect] = useState('');
	const [selectedLabel, setSelectedLabel] = useState(1);
	const [loading, setLoading] = useState(false);
	const emptyToastProps = {content: null}
	const [showToast, setShowToast] = useState(false);
	const [checkIfPlanLimitReached, setForPlanLimit] = useState(false);
	const [shouldNavigate, setShouldNavigate] = useState(false);

	const handleUpgradeClick = () => {
		setShouldNavigate(true);
		navigate('/pricing-plan');
	};

	const navigate = useNavigate();
	const radioChange = useCallback((_, newValue) => setValue(newValue), []);
	const handleDiscountCodeChange = useCallback((newValue) => {
		let validValue = isNaN(newValue) ? '' : Math.max(0, Number(newValue));
	  
		setNumberOfCode(validValue === 0 ? '' : validValue.toString());
	}, []);
		
	const handleAdvancedRadioChange = useCallback((_, selected) => setAdvancedValue(selected), []);
	const handleFieldValuePattern = useCallback((newValue) => setTextFieldValuePattern(newValue) , []);
	const popupHandler = useCallback(() => setModalValueActive((active) => !active), [setModalValueActive]);

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

	const handleTextErrorChange = (error) => {
		setTextErrorFromChild(error);
	}
	const makeApiCall = useApiCall();
	const toastMarkup = showToast ?
		<Toast content="Discount Codes is being uploaded" onDismiss={() => setShowToast(emptyToastProps)}/> :
	null;

	const handleGenerateDiscountCodes = async () => {
		setLoading(true);
		setShowToast(false)
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
		const { data: responseData, error, redirectToPricing } = await makeApiCall('/api/generate-discount-codes', 'POST', data);
		setLoading(false);
		if(redirectToPricing){
			return navigate('/pricing-plan');
		}
		if(responseData.result.hasUpdatedDataBase){
			setShowToast(true)
			setTimeout(() => {
				return navigate('/navigation/managediscount')
			}, 2000);
		}
		if (error) {
			console.log('Error: ', error);
		}
	};
	useAppQuery({
		url: `/api/get-dashboard-data`,
		reactQueryOptions: {
		  onSuccess: (data) => {
			if(data.success){
				let uploadRemaining = data.data.data.uploadLimit - data.data.data.discountUploadedSuccessfully;
				if(data.data.data.currentPlan === "FREE" && uploadRemaining == 0){
					setForPlanLimit(true);
				}
			}
		  },
		},
	});

	return (
		<Page
			backAction={{content: 'Products', url: '/'}}
			title={t("CreateDiscount.discount_title")}
			primaryAction={{
				content: loading ? (
					<Spinner size="small" color="teal" />
				) : (
					t('generate_discount_codes')
				),
				onAction: handleGenerateDiscountCodes,
				disabled: ( textErrorFromChild || (selectedOptionsFromSelect=='') || (advancedCheckValue.length > 0 &&  textFieldValuePattern.length === 0) || isEmpty(numberOfCode) || checkIfPlanLimitReached  )
			}}
		>
		{checkIfPlanLimitReached ? (
			<div style={{ padding: '20px 0px 20px 0px' }}>
				 <Banner onDismiss={() => setForPlanLimit(emptyToastProps)}>
					<p>
					Please{' '}
					<Link
						onClick={handleUpgradeClick}
					>
						upgrade your plan
					</Link>{' '}
					to upload more Discount Codes
					</p>
				</Banner>
			</div>
		) : (<div> </div>)}
			{toastMarkup}
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