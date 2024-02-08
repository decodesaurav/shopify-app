<?php

namespace App\Services;

use App\Contracts\DiscountServiceInterface;
use App\Contracts\DiscountRepositoryInterface;
use App\Services\DataPreparationService;

class DiscountService implements DiscountServiceInterface {

	protected $repository;
	protected $prepareData;

	public function __construct(DiscountRepositoryInterface $repository)
	{
		$this->repository = $repository;
		$this->prepareData = new DataPreparationService();
	}
	public function createDiscountCodeOnShopify($dataFromRequest){
		$preparedDataForDB = $this->prepareData->prepareDataForDB($dataFromRequest);
		$saveInfoToModel = $this->repository->saveDiscountToDB($preparedDataForDB);
	}
}