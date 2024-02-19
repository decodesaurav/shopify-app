<?php
namespace App\Http\Controllers\API\Shopify\Rest;

use App\Contracts\ShopifyRestAPIServiceInterface;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;

class FetchDiscountForShop extends Controller {

	protected $shopifyRestAPIService;

	public function __construct(ShopifyRestAPIServiceInterface $shopifyAPIServiceInterface)
	{
		$this->shopifyRestAPIService = $shopifyAPIServiceInterface;
	}

	public function fetchDiscountForShop(Request $request){
		try{
			$shopifyStore = $request->get('shopifySession')->db_session;
			$getCurrentDiscounts = $this->shopifyRestAPIService->countOfDiscountCode($shopifyStore);
			if( $getCurrentDiscounts['success'] !== false ){
				$discountData = json_decode($getCurrentDiscounts['response']->getBody(), true);
				if( is_array($discountData) && count($discountData)>0 ){
					$prepareDataToSendToUI = $this->prepareDataForUI($discountData);
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

	private function prepareDataForUI($discountBody){
		$priceRuleWithDiscountTitle = array_map(function($item){
			return [
				'id' => $item['id'],
				'discount_name' => $item['title']
			];
		}, $discountBody['price_rules']);

		return $priceRuleWithDiscountTitle;
	}
}
?>