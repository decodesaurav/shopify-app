<?php

namespace App\Contracts;


interface ShopifyRestAPIServiceInterface {
	public function countOfDiscountCode($shopifySessionData);
}