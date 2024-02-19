<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Services\DiscountService;
use App\Services\GraphQLService;

class CreateDiscountCodes implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
	protected $codes;
	protected $discountId;
	protected $shopifySession;
	protected $graphQlQuery;
	protected $variables;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($codes,$discountId,$shopifySession)
    {
        $this->codes = $codes;
		$this->discountId = $discountId;
		$this->shopifySession = $shopifySession;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
		$graphQlService = new GraphQLService();
		$graphQLQueryForDiscountPost ='
			<<<QUERY
				mutation discountRedeemCodeBulkAdd($discountId: ID!, $codes: [DiscountRedeemCodeInput!]!) {
					discountRedeemCodeBulkAdd(discountId: $discountId, codes: $codes) {
						bulkCreation {
							id
						}
						userErrors {
							code
							field
							message
						}
					}
				}
			QUERY
		';
		$variables = [
			"discountId" => $this->discountId,
			"codes" => $this->codes,
		];
        $makeRandomDiscountCode = $graphQlService->sendQuery($graphQLQueryForDiscountPost, $variables, $this->shopifySession );
    }
}
