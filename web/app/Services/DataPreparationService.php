<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class DataPreparationService{

	public function prepareDataForDB($discountData, $shopifySessionId){
		$dataToBeSavedToDB = array(
			"code_type" => $discountData['value'] ?? null ,
			"number_of_code" => $discountData['numberOfCode'] ?? null,
			"random_number_in_code" => !empty($discountData['advancedCheckValue']) ? null : $discountData['numberOfCodeDiscount'],
			"code_prefix" => $discountData['textFieldValuePrefixParent'] ?? null,
			"code_suffix" => $discountData['textFieldValueSuffixParent'] ?? null,
			"priority_of_code" => $discountData['priorityOfDiscountCode'] ?? null,
			"map_to_shopify_discount" => $discountData['selectedOptionsFromSelect'][0] ?? null,
			"price_rule" => $discountData['selectedLabel'][0] ?? null,
			"is_advanced_checked" => !empty($discountData['advancedCheckValue']) ?? false,
			"has_field_value_pattern" => $discountData['textFieldValuePattern'] ?? false,
			"shopify_session_id" => $shopifySessionId->id,
			'is_published_to_shopify'=> "failed"
		);
		return $dataToBeSavedToDB;
	}

	public function prepareDiscountDataForShopify($discountDataToSend){
		$numberOfCodeToGenerate = $discountDataToSend['number_of_code'];
		$randomNumberOrLetter = $discountDataToSend['random_number_in_code'];
		$codePrefix = $discountDataToSend['code_prefix'];
		$codeSuffix = $discountDataToSend['code_suffix'];
		if($discountDataToSend['code_type'] === 'random' && $discountDataToSend['is_advanced_checked'] === false ){
			$generatedCodes = [];
			for ($i = 1 ; $i<=$numberOfCodeToGenerate ; $i++){
				$randomString = $this->generateRandomString($randomNumberOrLetter);
				$generatedCode = '';
				if ($codePrefix) {
					$generatedCode .= $codePrefix . '-';
				}
				$generatedCode .= $randomString;
				if ($codeSuffix) {
					$generatedCode .= '-' . $codeSuffix;
				}
				$generatedCodes[] = ['code' => $generatedCode];
			}
			return $generatedCodes;
		} else {
			$pattern = $discountDataToSend['has_field_value_pattern'];
			$numberOfAdvanceCodeToGenerate = $discountDataToSend['number_of_code'];
			for($i = 0 ; $i<$numberOfAdvanceCodeToGenerate ; $i++){
				$randomString = $this->generateRandomStringForAdvancedPattern($pattern, $discountDataToSend['shopify_session_id']);
				$generatedCodes[] = ['code' => $randomString];
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
		if (isset($sortStringArray[1]) && !empty($sortStringArray[1])) {
			return $sortStringArray[1];
		} else {
			return '';
		}
	}

	public function prepareDataForUI($discountBody, $shopifyData){
		$priceRuleWithDiscountTitle = array_map(function($item) use ($shopifyData) {
			return [
				'discount_rule_id' => $item['id'],
				'discount_name' => $item['title'],
				'shopify_session_id' => $shopifyData['id'],
			];
		}, $discountBody['price_rules']);
	
		return $priceRuleWithDiscountTitle;
	}

	public function generateRandomStringForAdvancedPattern($pattern, $sessionId) {
		try {
			$characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			$randomString = '';
			Log::channel('daily')->info("Pattern before loop: " . $pattern);
	
			// Extract patterns within brackets
			preg_match_all("/\[(\S*?)\]/", $pattern, $matches);
			$patternArray = $matches[1];
	
			// Split the input pattern into segments based on the patterns found
			$patternSegments = preg_split("/\[\S*?\]/", $pattern);
	
			foreach ($patternSegments as $index => $segment) {
				// Append the text segment
				$randomString .= $segment;
	
				// Append the generated random string for the pattern type
				if (isset($patternArray[$index])) {
					$patternType = $patternArray[$index];
					$patternLength = intval(preg_replace('/[^0-9]/', '', $patternType));
					$isLetters = strpos($patternType, 'L') !== false;
					$isNumbers = strpos($patternType, 'N') !== false;
	
					if ($isLetters || $isNumbers) {
						// Handle alphanumeric patterns
						$randomString .= $this->generateSubstring($characters, $patternLength, $isLetters, $isNumbers);
					}
				}
			}
	
			return $randomString;
		} catch (\Exception $e) {
			Log::channel('daily')->error("Failed to generate the advanced discount code for " . $sessionId . " Error: " . $e->getMessage());
		}
	}	

	public function generateSubstring($characters, $length, $isLetters = true, $isNumbers = true) {
		$substring = '';
		// Generate random string based on the specified length and character types
		for ($i = 0; $i < $length; $i++) {
			$char = '';
	
			if ($isLetters && !$isNumbers) {
				$char .= $characters[rand(0, 51)]; // Letters only
			}
	
			if (!$isLetters && $isNumbers) {
				$char .= $characters[rand(52, 61)]; // Numbers only
			}
	
			if ($isLetters && $isNumbers) {
				$char .= $characters[rand(0, 61)]; // Both letters and numbers
			}
	
			$substring .= $char;
		}	
		return $substring;
	}
	
}