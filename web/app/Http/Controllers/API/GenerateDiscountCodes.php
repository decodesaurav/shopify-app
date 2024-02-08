<?php 
namespace App\Http\Controllers\API;

use App\Contracts\DiscountServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GenerateDiscountCodes extends Controller {

	protected $discountService;

	public function __construct(DiscountServiceInterface $discountService)
	{
		$this->discountService = $discountService;
	}

	public function generateDiscountCode(Request $request){
		$generateDiscountCode = $this->discountService->createDiscountCodeOnShopify($request->input());
		return response()->json([
			'status' => 200,
			'success' => true,
			'data' => $generateDiscountCode
		]);
	}
}
?>