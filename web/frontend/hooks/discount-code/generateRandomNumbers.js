import { useEffect, useState } from "react";

export const useRandomTextGenerator = (numberOfCode = 5) => {
	const [randomText,setRandomText] = useState(generateRandomText(numberOfCode));

	function generateRandomText(length){
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let result = '';
		for(let i=0; i<length ; i++){
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}
		return result;
	}

	useEffect(() => {
		const updateRandomValues = () => {
			const newRandomText = generateRandomText(numberOfCode);
			setRandomText(newRandomText);
		};
		updateRandomValues();
	}, [numberOfCode]);

	return {randomText};

}