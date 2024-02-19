<?php

namespace App\Contracts;


interface ShopifyGraphqlAPIServiceInterface {
	public function createDiscountCodeOnShopify($dataFromRequest, $shopifySession);
	public function getDiscountFromDB($shop_details, $sort, $searchQuery, $currentPage);
	public function getFailedDiscountFromDB($shop_details, $search, $searchQuery, $currentPage);
}