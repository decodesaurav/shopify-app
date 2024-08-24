<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API;
use App\Http\Controllers\API\Shopify\GraphQL\GenerateDiscountCodes;
use App\Http\Controllers\API\Shopify\Rest\FetchDiscountForShop;
use App\Http\Controllers\API\Shopify\GraphQL\BillingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => 'shopify.auth'], function(){
	Route::post('/generate-discount-codes', [GenerateDiscountCodes::class, 'generateDiscountCode'] );
	Route::get('/get-all-discounts', [GenerateDiscountCodes::class, 'fetchDiscountsFromDB'] );
	Route::get('/get-failed-discounts', [GenerateDiscountCodes::class, 'fetchFailedDiscountBatch'] );
	Route::get('/get-discount-for-shop', [FetchDiscountForShop::class, 'fetchDiscountForShop']);
	Route::get('/search-discounts', [FetchDiscountForShop::class, 'fetchDiscountRulesFromDB']);
	Route::get('/get-dashboard-data', [FetchDiscountForShop::class, 'fetchDashboardData']);
	Route::get('/check-pricing-status', [BillingController::class, 'hasPayment'])->name('check-pricing');
	Route::post('/accept-pricing-plan', [BillingController::class, 'requestPayment'])->name('confirm-pricing');
});
