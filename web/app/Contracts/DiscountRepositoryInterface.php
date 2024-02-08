<?php

namespace App\Contracts;


interface DiscountRepositoryInterface {
	public function saveDiscountToDB($discountData);
}