<?php

namespace App\Services;

class DataPreparationService{

	public function prepareDataForDB($discountData, $shopifySessionId){
		$dataToBeSavedToDB = array(
			"code_type" => $discountData['value'] ?? null ,
			"number_of_code" => $discountData['numberOfCode'] ?? null,
			"random_number_in_code" => $discountData['numberOfCodeDiscount'] ?? null,
			"code_prefix" => $discountData['textFieldValuePrefixParent'] ?? null,
			"code_suffix" => $discountData['textFieldValueSuffixParent'] ?? null,
			"priority_of_code" => $discountData['priorityOfDiscountCode'] ?? null,
			"map_to_shopify_discount" => $discountData['selectedOptionsFromSelect'][0] ?? null,
			"price_rule" => $discountData['selectedLabel'][0] ?? null,
			"is_advanced_checked" => !empty($discountData['advancedCheckValue']) ?? false,
			"has_field_value_pattern" => $discountData['textFieldValuePattern'] ?? false,
			"shopify_session_id" => $shopifySessionId->id,
			'is_published_to_shopify'=> false
		);
		return $dataToBeSavedToDB;
	}

	public function prepareDiscountDataForShopify($discountDataToSend){
		$numberOfCodeToGenerate = $discountDataToSend['number_of_code'];
		$randomNumberOrLetter = $discountDataToSend['random_number_in_code'];
		$codePrefix = $discountDataToSend['code_prefix'];
		$codeSuffix = $discountDataToSend['code_suffix'];
		if($discountDataToSend['code_type'] === 'random'){
			$generatedCodes = [];
			for ($i = 1 ; $i<=$numberOfCodeToGenerate ; $i++){
				$randomString = $this->generateRandomString($randomNumberOrLetter);
				$generatedCode = $codePrefix . '-' . $randomString . '-' . $codeSuffix;
				$generatedCodes[] = ['code' => $generatedCode];
			}
			return $generatedCodes;
		}
	}

	public function generateRandomString($randomLength) {
		$charactersPresent = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$randomString = '';
		for( $i=0; $i< $randomLength; $i++ ){
			$randomString .= $charactersPresent[rand(0, strlen($charactersPresent) - 1)];
		}
		return $randomString;
	}

	public function getSortString($data){
		$sortStringArray = explode(' ', $data);
		$sortString = $sortStringArray[1];
		return $sortString;
	}
}