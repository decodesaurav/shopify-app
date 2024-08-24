<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiscountRulesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
		Schema::create('discount_rules', function (Blueprint $table) {
			$table->id();
			$table->char('discount_rule_id');
			$table->char('discount_name');
			$table->unsignedBigInteger('shopify_session_id');
			$table->foreign('shopify_session_id')->references('id')->on('sessions')->onDelete('cascade');
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
        Schema::dropIfExists('discount_rules');
    }
}
