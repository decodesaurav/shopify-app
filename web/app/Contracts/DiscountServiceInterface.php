<?php

namespace App\Contracts;


interface DiscountServiceInterface {
	public function createDiscountCodeOnShopify($dataFromRequest);
}