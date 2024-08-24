import { useAppBridge, Modal } from '@shopify/app-bridge-react';
import {Layout,
	TextField,
	Link,
	Frame,
	Divider
} from '@shopify/polaris';
import {React} from 'react';

export default function AdvancedCodeComponent (props) {
	console.log(props.modalValue)
	const messageContent = `
		1. [3LN] generates 3 random letters and numbers.
		2. [3L]  generates 3 random letters.
		3. [3N]  generates 3 random numbers.
		For Example: BLACKFRIDAY-[6LN] could generate a code such as BLACKFRIDAY-3Q4F5A,
		[3N]-[3N]-[3N] could generate a code such as 123-456-789,
		FB-[5L]-20OFF could generate a code such as FB-ABCDE-20OFF
	`;

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
			<div style={{height: '500px'}}>
				<Modal
					open={props.modalValue}
					title="Pattern Examples"
					message={messageContent}
					primaryAction={{
						content: 'Close',
						onAction: props.popupHandler,
					}}
					onClose={props.popupHandler}
				/>
			</div>
		)}
	</Layout.Section>
	</>
	);
}