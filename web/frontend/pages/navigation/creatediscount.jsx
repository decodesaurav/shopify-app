import {Layout,
		Page,
		LegacyCard,
		TextField,
		Link,
		RadioButton,
		OptionList,
		Modal,
		Frame,
		Banner,
		Divider} from '@shopify/polaris';
import {React,useState, useCallback} from 'react';
import { useTranslation } from 'react-i18next';
import {CodeComponent } from '../../components/CodeComponent';
import AdvancedSetting from '../../components/create-discount/AdvancedSetting';
import { SelectDiscount } from "../../components/AutoComplete";

export default function CreateDiscount() {
	const {t} = useTranslation();
	const [title, setTitle] = useState('');
	const [value, setValue] = useState('disabled');
	const [numberOfCode, setNumberOfCode] = useState('1');
	const [textFieldValuePattern, setTextFieldValuePattern] = useState('[8LN]');
	const [advancedCheckValue, setAdvancedValue] = useState([]);
	const [modalValue, setModalValueActive] = useState(false);


	const handleTitleChange = useCallback((value) => setTitle(value), [title]);
	const radioChange = useCallback((_, newValue) => setValue(newValue), []);
	const handleDiscountCodeChange = useCallback((newValue) =>{
	const validValue = Math.max(1,newValue);
		setNumberOfCode(validValue);
	}, []);
	const handleAdvancedRadioChange = useCallback((_, selected) => setAdvancedValue(selected), []);
	const handleFieldValuePattern = useCallback((newValue) => setTextFieldValuePattern(newValue) , []);
	const popupHandler = useCallback(() => setModalValueActive((active) => !active), []);

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
					<div style={{ marginBottom: '16px' }}>
						<TextField
							value={title}
							onChange={handleTitleChange}
							label="Title"
							type="title"
							placeholder="Example: Black Friday 2023"
						/>
					</div>
					<SelectDiscount />
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
								<CodeComponent />
								) : (
									<>
										<Layout.Section>
											<TextField
												label="Pattern"
												type="text"
												value={textFieldValuePattern}
												onChange={handleFieldValuePattern}
											/>
											<Link onClick={popupHandler}>Need help choosing a pattern?</Link>
											{ modalValue && (
												<>
													<div style={{height: '500px'}}>
														<Frame>
															<Modal
																activator={modalValue}
																open={modalValue}
																onClose={popupHandler}
																title="Pattern Examples"
																primaryAction={{
																	content: 'Close',
																	onAction: popupHandler,
																}}
															>
																<Modal.Section>
																	<ul>
																		<li>
																			<b>[3LN]</b> generates 3 random letters and numbers.														
																		</li>
																		<li>
																			<b>[3L]</b> generates 3 random letters and numbers.														
																		</li>
																		<li>
																			<b>[3N]</b> generates 3 random letters and numbers.														
																		</li>
																	</ul>
																	<Divider borderColor="border" />
																	<ul>
																		<li>
																			<b>e.g. BLACKFRIDAY-[6LN] </b> could generate a code such as BLACKFRIDAY-3Q4F5A
																		</li>
																		<li>
																			<b>e.g. [3N]-[3N]-[3N] </b> could generate a code such as 123-456-789
																		</li>
																		<li>
																			<b>e.g. FB-[5L]-20OFF</b> could generate a code such as FB-ABCDE-20OFF
																		</li>
																	</ul>
																</Modal.Section>
															</Modal>
														</Frame>
													</div>
												</>
											)}
										</Layout.Section>
									</>
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
				<div className='dynamicInfo'>
					<LegacyCard title="Summary" sectioned>
						<p>Add information of the discount coupon here.</p>
					</LegacyCard>
				</div>
				<div id='discountPreview' style={{marginTop: '20px'}}>
					<LegacyCard title="Preview" sectioned>
						<p>You'll see the example of code being generated here!</p>
					</LegacyCard>
				</div>
			</Layout.Section>
			</Layout>
		</Page>
	);
}