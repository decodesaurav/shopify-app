<?php

namespace App\Contracts;


interface DiscountRepositoryInterface {
	public function saveDiscountToDB($discountData);
	public function fetchDiscountFromDB($shop_data, $sortBy, $searchQuery, $currentPage);
	public function fetchFailedDiscountFromDB($shop_data, $sortBy, $searchQuery, $currentPage);
	public function storeAndUpdatePriceRules($response, $shopifyData);
	public function fetchDiscountRulesFromDb($shopData,$shopQuery);
	public function fetchDashboardData($data);
}