import {Layout,
		Page,
		LegacyCard,
		TextField,
		RadioButton,
		OptionList,
		Link
} from '@shopify/polaris';
import {React,useState, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import {CodeComponent } from '../../components/create-discount/CodeComponent';
import AdvancedSetting from '../../components/create-discount/AdvancedSetting';
import AdvancedCodeComponent from '../../components/create-discount/AdvancedCodeComponent';
import TitleComponent from '../../components/create-discount/DiscountDetails';
import SummaryComponent from '../../components/create-discount/SummaryComponent';
import { SelectDiscount } from '../../components/create-discount/AutoComplete';

export default function CreateDiscount() {
	const {t} = useTranslation();
	const [value, setValue] = useState('disabled');
	const [numberOfCode, setNumberOfCode] = useState('100');
	const [numberOfCodeDiscount, setNumberOfCodeDiscount] = useState('1');
	const [textFieldValuePattern, setTextFieldValuePattern] = useState('[8LN]');
	const [advancedCheckValue, setAdvancedValue] = useState([]);
	const [modalValue, setModalValueActive] = useState(false);
	const [selectedOptionsFromSelect, setSelectedOptionsFromSelect] = useState([]);

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

	return (
		<Page
			backAction={{content: 'Products', url: '/'}}
			title={t("CreateDiscount.discount_title")}
			primaryAction={{
				content : t("generate_discount_codes"),
			}}			
		>
		<Layout>
			<Layout.Section>
				<LegacyCard title="Discount details" sectioned>
					<TitleComponent />
					<SelectDiscount onSelectionChange={handleSelectionChange} />
					<div style={{ marginTop: '16px' }}>
						<Link url="https://help.shopify.com/manual">Create New Discount</Link>
					</div>
				</LegacyCard>
				<LegacyCard title="Codes" sectioned>
					<div style={{ marginBottom: '16px' }}>
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<RadioButton
								label="Generate Random Codes"
								checked={value === 'disabled'}
								id="disabled"
								name="random"
								onChange={radioChange}
							/>
							<RadioButton
								label="Import Existing Codes"
								id="optional"
								name="import"
								checked={value === 'optional'}
								onChange={radioChange}
							/>
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
								onChange={(selected) => handleAdvancedRadioChange(null,selected)}
								options={[
									{value: 'advanced_pattern', label: t("CreateDiscount.use_advanced_pattern")},
								]}
								selected={advancedCheckValue}
								allowMultiple
							/>
						</div>
					</div>
				</LegacyCard>

				<LegacyCard sectioned>
					<Layout>
						<Layout.Section>
							<AdvancedSetting />
						</Layout.Section>
					</Layout>
				</LegacyCard>

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