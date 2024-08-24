<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiscountCodesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('discount_codes', function (Blueprint $table) {
            $table->id();
			$table->char('code_type')->nullable();
			$table->integer('random_number_in_code')->nullable();
			$table->integer('number_of_code')->nullable();
			$table->char('code_prefix', 15);
			$table->char('code_suffix', 15);
			$table->string('priority_of_code', 10);
			$table->string('map_to_shopify_discount', 50);
			$table->string('price_rule', 20);
			$table->boolean('is_advanced_checked');
			$table->char('has_field_value_pattern',50);
			$table->foreignId('shopify_session_id')	->constrained('sessions')
													->onDelete('cascade')
													->index();
			$table->char('is_published_to_shopify',10);
			$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('discount_codes');
    }
}
