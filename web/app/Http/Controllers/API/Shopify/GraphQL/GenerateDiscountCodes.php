<?php
namespace App\Http\Controllers\API\Shopify\GraphQL;

use App\Contracts\ShopifyGraphqlAPIServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GenerateDiscountCodes extends Controller {

	protected $discountService;

	public function __construct(ShopifyGraphqlAPIServiceInterface $discountService)
	{
		$this->discountService = $discountService;
	}

	public function generateDiscountCode(Request $request){
		$shopify_session_id = $request->get('shopifySession')->db_session;
		$generateDiscountCode = $this->discountService->createDiscountCodeOnShopify($request->input(), $shopify_session_id);
		return response()->json([
			'status' => 200,
			'success' => true,
			'data' => json_decode($generateDiscountCode->getContent())
		]);
	}

	public function fetchDiscountsFromDB(Request $request){
		$shopify_session_id = $request->get('shopifySession')->db_session;
		$sortBy = $request->query('sort');
		$searchQuery = $request->query('search');
		$currentPage = $request->query('page');
		$fetchDiscountFromDB = $this->discountService->getDiscountFromDB($shopify_session_id, $sortBy, $searchQuery, $currentPage);
		return response()->json([
			'success'	=> true,
			'data'	=> $fetchDiscountFromDB['discounts'],
			'count' => $fetchDiscountFromDB['count']
		]);
	}
	public function fetchFailedDiscountBatch(Request $request){
		$shopify_session_id = $request->get('shopifySession')->db_session;
		$sort_by = $request->query('sort');
		$searchQuery = $request->query('search');
		$currentPage = $request->query('page');
		$fetchDiscountFromDB = $this->discountService->getFailedDiscountFromDB($shopify_session_id, $sort_by, $searchQuery, $currentPage);
		return response()->json([
			'success'	=> true,
			'data'	=> $fetchDiscountFromDB['discounts'],
			'count' => $fetchDiscountFromDB['count']
		]);
	}
}