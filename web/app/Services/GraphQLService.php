<?php

namespace App\Services;

use GuzzleHttp\Client;
use Shopify\Clients\Graphql;

class GraphQLService
{
	protected $client;

	public function __construct()
	{
		//
	}

	public function sendQuery($query, $variables = [], $shopifySession)
	{
		$callGraphQl = new Graphql($shopifySession['shop']);
		$response = $callGraphQl->query( $query, $variables);

		return json_decode($response->getBody(), true);
	}
}