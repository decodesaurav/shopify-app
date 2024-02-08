<?php

namespace App\Services;

class DataPreparationService{

	public function prepareDataForDB($discountData){
		$dataToBeSavedToDB = array(
			"code_type" => $discountData['value'] ?? null ,
			"number_of_code" => $discountData['numberOfCode'] ?? null,
			"random_number_in_code" => $discountData['numberOfCodeDiscount'] ?? null,
			"code_prefix" => $discountData['textFieldValuePrefixParent'] ?? null,
			"code_suffix" => $discountData['textFieldValueSuffixParent'] ?? null,
			"priority_of_code" => $discountData['priorityOfDiscountCode'] ?? null,
			"map_to_shopify_discount" => $discountData['selectedOptionsFromSelect'][0] ?? null,
			"is_advanced_checked" => $discountData['advancedCheckValue'] ?? false,
			"has_field_value_pattern" => $discountData['textFieldValuePattern'] ?? false
		);

		return $dataToBeSavedToDB;
	}

}