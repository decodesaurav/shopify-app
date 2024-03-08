<?php

use App\Lib\EnsureBilling;

return [

    /*
    |--------------------------------------------------------------------------
    | Shopify billing
    |--------------------------------------------------------------------------
    |
    | You may want to charge merchants for using your app. Setting required to true will cause the EnsureShopifySession
    | middleware to also ensure that the session is for a merchant that has an active one-time payment or subscription.
    | If no payment is found, it starts off the process and sends the merchant to a confirmation URL so that they can
    | approve the purchase.
    |
    | Learn more about billing in our documentation: https://shopify.dev/docs/apps/billing
    |
    */
	"billing" => [
        "required" => true,
        "interval" => EnsureBilling::INTERVAL_EVERY_30_DAYS,
        "chargeName" => "Early Bird Plan",
        'early_adopter_recurring_charge_1_99' => [
            "chargeName" => "Early Adopter Recurring Charge",
            "slug" => "early_adopter_recurring_charge_1_99",
            "amount" => 1.99,
            "currencyCode" => "USD", // Currently only supports USD
            "interval" => EnsureBilling::INTERVAL_EVERY_30_DAYS,
        ],
    ],
	"free_plan" => [
        "required" => false,
        "interval" => EnsureBilling::INTERVAL_EVERY_30_DAYS,
        "chargeName" => "Release Plan",
        'free_plan' => [
            "chargeName" => "Release Plan",
            "slug" => "free_plan",
            "amount" => 1.99,
            "currencyCode" => "USD", // Currently only supports USD
            "interval" => EnsureBilling::INTERVAL_EVERY_30_DAYS,
		],
	],
];

