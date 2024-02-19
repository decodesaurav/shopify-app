<?php

namespace App\ServiceRepoProvider;

use App\Repositories\DiscountRepository;
use App\Contracts\ShopifyGraphqlAPIServiceInterface;
use App\Contracts\DiscountRepositoryInterface;
use App\Contracts\ShopifyRestAPIServiceInterface;
use App\Services\DiscountService;
use App\Services\ShopifyRestAPIService;
use Illuminate\Support\ServiceProvider;


class ServiceRepoProvider extends ServiceProvider {
	 /**
     * Register services.
     *
     * @return void
     */

	 public function register()
	 {
		 //
	 }
 
	 /**
	  * All of the container bindings that should be registered.
	  *
	  * @var array
	  */
	 public $bindings = [
		DiscountRepositoryInterface::class => DiscountRepository::class,
		ShopifyGraphqlAPIServiceInterface::class=> DiscountService::class,
		ShopifyRestAPIServiceInterface::class=>ShopifyRestAPIService::class
	 ];
}