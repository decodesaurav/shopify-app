<?php

namespace App\ServiceRepoProvider;

use App\Repositories\DiscountRepository;
use App\Contracts\DiscountServiceInterface;
use App\Contracts\DiscountRepositoryInterface;
use App\Services\DiscountService;
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
		DiscountServiceInterface::class=> DiscountService::class
	 ];
}