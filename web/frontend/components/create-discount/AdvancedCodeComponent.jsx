import {Layout,
	TextField,
	Link,
	Frame,
	Modal,
	Divider
} from '@shopify/polaris';
import {React} from 'react';

export default function AdvancedCodeComponent (props) {

	return (
		<>
			<Layout.Section>
				<TextField
					label="Pattern"
					type="text"
					value={props.textFieldValuePattern}
					onChange={props.handleFieldValuePattern}
				/>
				<Link onClick={props.popupHandler}>Need help choosing a pattern?</Link>
				{ props.modalValue && (
					<>
						<div style={{height: '500px'}}>
							<Frame>
								<Modal
									activator={props.modalValue}
									open={props.modalValue}
									onClose={props.popupHandler}
									title="Pattern Examples"
									primaryAction={{
										content: 'Close',
										onAction: props.popupHandler,
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
	);
}