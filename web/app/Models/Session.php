<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;
	protected $fillable = [
        'session_id',
        'shop',
        'is_online',
        'state',
        'user_id',
        'user_first_name',
        'user_last_name',
        'user_email',
        'user_email_verified',
        'account_owner',
        'locale',
        'collaborator',
        'subscribed_package',
		'app_subscription_id'
    ];

	public function discountCodes(){
		return $this->hasMany(DiscountCodes::class);
	}
}