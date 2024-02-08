<?php

namespace App\Repositories;

use App\Contracts\DiscountRepositoryInterface;
use App\Models\DiscountCodes;

class DiscountRepository implements DiscountRepositoryInterface {
	public function saveDiscountToDB($discountData){
		return true;
	}
}