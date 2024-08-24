<?php

namespace App\Services;

use App\Contracts\ShopifyGraphqlAPIServiceInterface;
use App\Contracts\DiscountRepositoryInterface;
use App\Jobs\CreateDiscountCodes;
use App\Services\GraphQLService;
use App\Models\Session;
use App\Models\DiscountCodes;
use App\Services\DataPreparationService;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Log;

class DiscountService implements ShopifyGraphqlAPIServiceInterface {

	protected $repository;
	protected $prepareData;
	protected $graphQLService;

	use ApiResponseTrait;

	public function __construct(DiscountRepositoryInterface $repository, GraphQLService $graphQLService)
	{
		$this->repository = $repository;
		$this->prepareData = new DataPreparationService();
		$this->graphQLService = $graphQLService;
	}
	public function createDiscountCodeOnShopify($dataFromRequest, $shopifySession)
	{
		try{
			$preparedDataForDB = $this->prepareData->prepareDataForDB($dataFromRequest, $shopifySession);
			$saveInfoToModel = $this->repository->saveDiscountToDB($preparedDataForDB);
			$checkSaveSuccessfulToDB = json_decode($saveInfoToModel->getContent(), true);
			if ($checkSaveSuccessfulToDB['success'] !== true) {
				return response()->json([
					'success' => false
				]);
			}

			$makeRandomDiscountCode = $this->makeRandomDiscountCode($checkSaveSuccessfulToDB['data']);

			if($makeRandomDiscountCode !== null) {
				$discountId = $checkSaveSuccessfulToDB['data']['price_rule'];
				$chunkedCode = array_chunk($makeRandomDiscountCode, 25);

				$response = false;

				foreach ($chunkedCode as $codes) {
					$response = CreateDiscountCodes::dispatch($codes, $discountId, $shopifySession);
				}
			} else {
				return $this->successResponse([
					'advancedPatternFailed' => true
				]);
			}

			if ($response) {
				$shop = Session::where('id', $shopifySession->id)->first();
				$currentDiscountToUpdate = DiscountCodes::where('shopify_session_id', $shopifySession->id)->latest()->first();
				if ($shop && $currentDiscountToUpdate) {
					$data =["is_published_to_shopify" => "published"];
					$currentDiscountToUpdate->update($data);

					return $this->successResponse([
						'hasUpdatedDataBase' => true
					]);
				} else {
					return $this->errorResponse([
						500,
						'message' => 'Shop not found for the given session ID'
					]);
				}
			} else {
				return $this->successResponse([
					'hasUpdatedDataBase' => false
				]);
			}
		} catch (\Exception $e){
			Log::channel('daily')->error("Error while adding data to Database for $shopifySession->id " . $e->getMessage());
		}
	}	

	public function makeRandomDiscountCode($discountDetails){
		$preparedDiscountDataForShopify = $this->prepareData->prepareDiscountDataForShopify($discountDetails);
		return $preparedDiscountDataForShopify;
	}

	public function getDiscountFromDB($details, $sort, $searchQuery, $currentPage){
		$sortBy = $this->prepareData->getSortString($sort);
		$getDataFromDB = $this->repository->fetchDiscountFromDB($details, $sortBy, $searchQuery, $currentPage);
		if (!empty($getDataFromDB)) {
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
		} else {
			return [
				'discounts' => false,
				'count'=> 0
			];
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