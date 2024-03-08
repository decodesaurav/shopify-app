<?php

namespace App\Services;

use App\Contracts\ShopifyGraphqlAPIServiceInterface;
use App\Contracts\DiscountRepositoryInterface;
use App\Jobs\CreateDiscountCodes;
use App\Services\GraphQLService;
use App\Services\DataPreparationService;

class DiscountService implements ShopifyGraphqlAPIServiceInterface {

	protected $repository;
	protected $prepareData;
	protected $graphQLService;

	public function __construct(DiscountRepositoryInterface $repository, GraphQLService $graphQLService)
	{
		$this->repository = $repository;
		$this->prepareData = new DataPreparationService();
		$this->graphQLService = $graphQLService;
	}
	public function createDiscountCodeOnShopify($dataFromRequest, $shopifySession){
		$preparedDataForDB = $this->prepareData->prepareDataForDB($dataFromRequest, $shopifySession);
		$saveInfoToModel = $this->repository->saveDiscountToDB($preparedDataForDB);
		$checkSaveSuccessfulToDB = json_decode($saveInfoToModel->getContent(), true);
		if($checkSaveSuccessfulToDB['success'] === true){
			$makeRandomDiscountCode = $this->makeRandomDiscountCode($checkSaveSuccessfulToDB['data']);
			$discountId = $checkSaveSuccessfulToDB['data']['price_rule'];
			$chunkedCode = array_chunk($makeRandomDiscountCode, 25);
			foreach ($chunkedCode as $codes){
				$response = CreateDiscountCodes::dispatch($codes, $discountId, $shopifySession );
				logger("Response" . json_encode($response));
			}
		} else {
			response()->json([
				'success' => false
			]);
		}
	}

	public function makeRandomDiscountCode($discountDetails){
		$preparedDiscountDataForShopify = $this->prepareData->prepareDiscountDataForShopify($discountDetails);
		return $preparedDiscountDataForShopify;
	}

	public function getDiscountFromDB($details, $sort, $searchQuery, $currentPage){
		$sortBy = $this->prepareData->getSortString($sort);
		$getDataFromDB = $this->repository->fetchDiscountFromDB($details, $sortBy, $searchQuery, $currentPage);
		$getContentFromResponse = $getDataFromDB->getContent();
		$decodedData = json_decode($getContentFromResponse);
		$discounts = [];
		foreach ($decodedData->result->data as $discountData){
			$discount = [
				'id' => $discountData->id,
				'numberOfDiscount' => $discountData->number_of_code,
				'shopifyDiscountTitle' => $discountData->map_to_shopify_discount,
				'codePrefix' => $discountData->code_prefix,
				'codeSuffix' => $discountData->code_suffix,
				'remarks' => $discountData->is_published_to_shopify
			];
			$discounts[] = $discount;
		}
		return [
			'discounts' => $discounts,
			'count'     => $decodedData->result->total
		];
	}
	public function getFailedDiscountFromDB($shop_details, $sort, $searchQuery, $currentPage){
		$sortBy = $this->prepareData->getSortString($sort);
		$getFailedDataFromDB = $this->repository->fetchFailedDiscountFromDB($shop_details, $sortBy, $searchQuery, $currentPage);
		$getContentFromResponse = $getFailedDataFromDB->getContent();
		$decodedData = json_decode($getContentFromResponse);
		$discounts = [];
		foreach ($decodedData->result->data as $discountData){
			$discount = [
				'id' => $discountData->id,
				'numberOfDiscount' => $discountData->number_of_code,
				'shopifyDiscountTitle' => $discountData->map_to_shopify_discount,
				'codePrefix' => $discountData->code_prefix,
				'codeSuffix' => $discountData->code_suffix,
				'remarks' => $discountData->is_published_to_shopify
			];
			$discounts[] = $discount;
		}
		return [
			'discounts' => $discounts,
			'count'     => $decodedData->result->total
		];
	}
}