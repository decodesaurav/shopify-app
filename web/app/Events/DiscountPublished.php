<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithBroadcasting;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DiscountPublished implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels, InteractsWithBroadcasting;

	public $discountId;
	public $sessionId;
	public $currentDiscountNumber;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($key,$discountId, $sessionId)
    {
        $this->discountId = $discountId;
		$this->sessionId = $sessionId;
		$this->currentDiscountNumber = $key;
		$this->broadcastVia('pusher');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('discount' . $this->sessionId);
    }
}
