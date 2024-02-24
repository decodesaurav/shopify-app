<?php
namespace App\Http\Controllers\API\Shopify\GraphQL;

use App\Contracts\ShopifyGraphqlAPIServiceInterface;
use App\Lib\EnsureBilling;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Config;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BillingController extends Controller {
	use ApiResponseTrait;
	public function hasPayment(Request $request)
    {
        $session = $request->get('shopifySession');
        if (EnsureBilling::check($session, Config::get('shopify.billing'))) {
            return $this->successResponse(['hasPayment' => true]);
        }
        return $this->successResponse(['hasPayment' => false]);
    }
}