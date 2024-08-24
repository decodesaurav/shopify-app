<?php

namespace App\Jobs;

use App\Models\DiscountCodes;
use App\Models\Session;
use App\Traits\ApiResponseTrait;
use Illuminate\Bus\Batchable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Shopify\Clients\Graphql;

class CreateDiscountCodes implements ShouldQueue
{
    use Batchable, Dispatchable, InteractsWithQueue, Queueable, SerializesModels, ApiResponseTrait;
	protected $codes;
	protected $discountId;
	protected $shopifySession;
	protected $graphQlQuery;
	protected $variables;

	public const CREATE_DISCOUNT_CODE_MUTATION =
	<<<'GRAPHQL'
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
	GRAPHQL;

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
		try{
			$client = new Graphql($this->shopifySession->shop, $this->shopifySession->access_token);
			$response = $client->query(
                [
                    "query" =>self::CREATE_DISCOUNT_CODE_MUTATION,
					"variables" => [
						"discountId" => "gid://shopify/DiscountCodeNode/$this->discountId",
						"codes" => $this->codes
					]
                ],
            );
			if ($response->getStatusCode() !== 200) {
				Log::channel('daily')->error('Failed to create discount codes for ' . $this->shopifySession->shop );
			} else {
				Log::channel("daily")->info("Data :" . json_encode($response->getBody()));
			}
		} catch (\Exception $e){
			$this->fail($e);
			Log::channel("daily")->info("Data :" . $e->getMessage());
			$this->release(7200);
		}
    }
}