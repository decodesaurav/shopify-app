<?php

namespace App\Services;

use App\Contracts\ShopifyRestAPIServiceInterface;
use Exception;
use GuzzleHttp\Client;

class ShopifyRestAPIService implements ShopifyRestAPIServiceInterface {

	public function countOfDiscountCode($shopifySessionData){
		$shopUrl = $shopifySessionData['shop'];
		$shopifyApiVersion = $_ENV['SHOPIFY_API_VERSION'];
		$accessToken = $shopifySessionData['access_token'];
		$client = new Client([
			'base_uri' => "https://$shopUrl/admin/api/$shopifyApiVersion/"
		]);
		try{
			$response = $client->get('price_rules.json',[
				'headers' => [
					'X-Shopify-Access-Token' => $accessToken,
				],
			]);
			if ($response->getStatusCode() === 200) {
				return [
					'success' => true,
					'response' => $response
				];
			} else {
				return [
					'success' => false,
					'message' => $response->getReasonPhrase()
				];
			}
		} catch(Exception $e){
			logger('Error: ' . $e->getMessage());
		}
	}

}