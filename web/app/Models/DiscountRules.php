<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiscountRules extends Model
{
    use HasFactory;
	protected $fillable = ['discount_rule_id', 'discount_name'];
}
