<?php

namespace App\Listeners;

use App\Events\DiscountPublished;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendDiscountPublishedNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\DiscountPublished  $event
     * @return void
     */
    public function handle(DiscountPublished $event)
    {
        $discountId = $event->discountId;
		$sessionId = $event->sessionId;
		$currentDiscountNumber = $event->currentDiscountNumber;
    }
}
