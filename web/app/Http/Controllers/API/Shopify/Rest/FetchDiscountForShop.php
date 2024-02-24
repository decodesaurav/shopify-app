<?php
namespace App\Http\Controllers\API\Shopify\Rest;

use App\Contracts\ShopifyRestAPIServiceInterface;
use App\Http\Controllers\Controller;
use App\Contracts\DiscountRepositoryInterface;
use App\Services\DataPreparationService;
use Exception;
use Illuminate\Http\Request;

class FetchDiscountForShop extends Controller {

	protected $shopifyRestAPIService;
	protected $repository;
	protected $prepareData;

	public function __construct(ShopifyRestAPIServiceInterface $shopifyAPIServiceInterface, DiscountRepositoryInterface $discountRepositoryInterface)
	{
		$this->shopifyRestAPIService = $shopifyAPIServiceInterface;
		$this->repository = $discountRepositoryInterface;
		$this->prepareData = new DataPreparationService();
	}

	public function fetchDiscountForShop(Request $request){
		try{
			$shopifyStore = $request->get('shopifySession')->db_session;
			$getCurrentDiscounts = $this->shopifyRestAPIService->countOfDiscountCode($shopifyStore);
			if( $getCurrentDiscounts['success'] !== false ){
				$saveDiscountRulesToDb = $this->repository->storeAndUpdatePriceRules(json_decode($getCurrentDiscounts['response']->getBody(), true), $shopifyStore);
				$discountData = json_decode($getCurrentDiscounts['response']->getBody(), true);
				if( is_array($discountData) && count($discountData)>0 ){
					$prepareDataToSendToUI = $this->prepareData->prepareDataForUI($discountData, $shopifyStore);
					return response()->json([
						'success' => true,
						'data' => $prepareDataToSendToUI
					]);
				} else {
					return response()->json([
						'success' => false,
						'message' => 'No discount Present.'
					]);
				}
			} else {
				return response()->json([
					'success' => false,
					'message' => $getCurrentDiscounts['message']
				]);
			}
		} catch (Exception $e) {
			logger('Error while fetching discount: ' . $e->getMessage());
		}
	}

	public function fetchDiscountRulesFromDB(Request $request){
		try{
			$shopifyStore = $request->get('shopifySession')->db_session;
			$searchQuery = $request->query('query');
			$getListOfDiscounts = $this->repository->fetchDiscountRulesFromDb($shopifyStore,$searchQuery);
			$response = json_decode($getListOfDiscounts->getContent());
			$discounts = [];
			foreach ($response->result as $discountData){
				$discount = [
					'id' => $discountData->discount_rule_id,
					'discount_name' => $discountData->discount_name
				];
				$discounts[] = $discount;
			}
			return response()->json([
				'success' => true,
				'data' => $discounts,
				'count' => 0,
			]);
		} catch (Exception $e){
			logger("Error while fetching discount from DB" . $e->getMessage());
		}
	}

	public function fetchDashboardData(Request $request){
		try{
			$shopifyStore = $request->get('shopifySession')->db_session;
			$getDashboardData = $this->repository->fetchDashboardData($shopifyStore);
			$response = json_decode($getDashboardData->getContent());
			return response()->json([
				'success' => true,
				'data' => $response
			]);
		} catch (Exception $e){
			logger("Error while fetching dashboard data from DB" . $e->getMessage());
		}
	}
}
?>