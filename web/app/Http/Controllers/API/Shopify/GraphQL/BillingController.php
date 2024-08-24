<?php
namespace App\Http\Controllers\API\Shopify\GraphQL;

use App\Contracts\ShopifyGraphqlAPIServiceInterface;
use App\Lib\EnsureBilling;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Config;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Session;
use App\Lib\TopLevelRedirection;
use App\Traits\APIHelper;
use App\Traits\ApiUtilsTrait;
use Exception;
use Illuminate\Support\Facades\Redis;
use Shopify\Utils;
use Shopify\Rest\Admin2024_01\RecurringApplicationCharge;

class BillingController extends Controller {

	use APIHelper,ApiResponseTrait,ApiUtilsTrait;
	
	public function requestPayment(Request $request)
    {
        try {
            $session = $request->get('shopifySession');
			$selectedPlanType = $request->input('planType');
			$shop = Session::where('session_id', $session->getId())->first();
			$current_package  = 'early_adopter_recurring_charge_1_99';
			if($selectedPlanType === "release"){
				$currentPackage = $session->db_session->subscribed_package === "early_adopter_recurring_charge_1_99";
				try{
					if($currentPackage){
						$sessions = Utils::loadCurrentSession($request->header(), $request->cookie(), $session->db_session->is_online);
						$currentSubscriptionId = $session->db_session->app_subscription_id;
						preg_match('/\d+$/', $currentSubscriptionId, $matches);
						if (!empty($matches)) {
							$subscriptionId = $matches[0];
						}
						RecurringApplicationCharge::delete($sessions, $subscriptionId);
					}
					$config = Config::get('shopify.free_plan')['free_plan'];
					$data = array('subscribed_package' => $config['slug']);
					$shop->update($data);
					return $this->successResponse(['hasFreePayment' => true]);
				} catch(\Exception $e){
					logger($e);
					return $this->errorResponse();
				}
			} else {
				$config = Config::get('shopify.billing')[$current_package];
				if ( EnsureBilling::check($session, $config)) {
					return $this->successResponse(['hasPayment' => true]);
				} else {
					$data = EnsureBilling::requestPayment($session, $config);
					$appSubscriptionId = $data["appSubscription"]["id"];
					$confirmationUrl = $data["confirmationUrl"];
					$data = array('subscribed_package' => $config['slug'], "app_subscription_id" => $appSubscriptionId);
					$shop->update($data);
					return TopLevelRedirection::redirect($request, $confirmationUrl);
				}
			}
        } catch (\Exception $e) {
            logger($e);
            return $this->errorResponse();
        }
    }

	public function hasPayment(Request $request)
    {
        $session = $request->get('shopifySession');
		$currentPlan = $session->db_session->subscribed_package;
		if($currentPlan !== null ){
			if( $currentPlan === "free_plan"){
				return $this->successResponse(['hasFreePayment' => true]);
			}
			if (EnsureBilling::check($session, Config::get('shopify.billing')[$currentPlan])) {
				return $this->successResponse(['hasPayment' => true]);
			}
		}
        return $this->successResponse(['hasPayment' => false]);
    }
}