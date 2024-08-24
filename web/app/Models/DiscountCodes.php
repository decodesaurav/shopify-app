<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountCodes extends Model
{
    use HasFactory;
	protected $fillable = ['discount_name', 'selected_discount_in_shopify', 'number_of_discount_codes', 'prefix_name', 'suffix_name','is_published_to_shopify'];
	protected $with = ['session'];

	public function session(){
		return $this->belongsTo(Session::class, 'shopify_session_id');
	}
}
