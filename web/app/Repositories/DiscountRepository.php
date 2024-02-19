<?php

namespace App\Repositories;

use App\Contracts\DiscountRepositoryInterface;
use App\Models\DiscountCodes;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\DB;

class DiscountRepository implements DiscountRepositoryInterface {
	public function saveDiscountToDB($discountData){
		try{
			$discountsData = [
				"code_type" => $discountData['code_type'],
				"number_of_code" => $discountData['number_of_code'],
				"random_number_in_code" => $discountData['random_number_in_code'],
				"code_prefix" => $discountData['code_prefix'],
				"code_suffix" => $discountData['code_suffix'],
				"priority_of_code" => $discountData['priority_of_code'],
				"map_to_shopify_discount" => $discountData['map_to_shopify_discount'],
				"price_rule" => $discountData['price_rule'],
				"is_advanced_checked" => $discountData['is_advanced_checked'],
				"has_field_value_pattern" => $discountData['has_field_value_pattern'],
				"shopify_session_id" => $discountData['shopify_session_id'],
				"is_published_to_shopify" => $discountData['is_published_to_shopify'],
				"created_at" => Carbon::now(),
				"updated_at" => Carbon::now(),
			];
			DB::table('discount_codes')->insert($discountsData);
			return response()->json([
				'success' => true,
				'data' => $discountData
			]);
		} catch (Exception $e) {
			return response()->json([
				'success' => false,
				'message' => $e->getMessage()
			]);
		}
	}
	public function fetchDiscountFromDB($shopData, $sortBy, $searchQuery, $currentPage)
	{
		try {
			$query = DiscountCodes::where('shopify_session_id', $shopData['id']);
			$countQuery = clone $query;
			if (empty($searchQuery)) {
				$discountCodeBatch = $query->orderBy('created_at', $sortBy)->paginate(getenv('PER_PAGE_PAGINATE'), ['*'], 'page', $currentPage);
			} else {
				$discountCodeBatch = $query->where('map_to_shopify_discount', 'LIKE', "%$searchQuery%")
					->orderBy('created_at', $sortBy)
					->paginate(getenv('PER_PAGE_PAGINATE'), ['*'], 'page', $currentPage);
			}
			$totalCount = $countQuery->count();
			$response = [
				"result" => $discountCodeBatch
			];
			if ($totalCount !== null) {
				$response["count"] = $totalCount;
			}
			return response()->json($response);
		} catch (Exception $e) {
			logger("Error in db operation of search, filter: " . $e->getMessage());
		}
	}

	public function fetchFailedDiscountFromDB($shop_data, $sortBy, $searchQuery, $currentPage){
		try{
			$query = DiscountCodes::where('shopify_session_id', $shop_data['id'])->where('is_published_to_shopify', 0);
			$countQuery = clone $query;
			if(empty($searchQuery)){
				$failedDiscountBatch = $query->orderBy('created_at', $sortBy)->paginate(getenv('PER_PAGE_PAGINATE'), ['*'], 'page', $currentPage);
			} else {
				$failedDiscountBatch = $query->where('map_to_shopify_discount', 'LIKE', "%$searchQuery%")
											->orderBy('created_at', $sortBy)
											->paginate(getenv('PER_PAGE_PAGINATE'), ['*'], 'page', $currentPage);
			}
			$totalCount = $countQuery->count();
			$response = [
				"result" => $failedDiscountBatch
			];
			if ($totalCount !== null) {
				$response["count"] = $totalCount;
			}
			return response()->json($response);
		} catch (Exception $e){
			logger("Error in db operation of search,filter" . $e->getMessage());
		}
	}
}