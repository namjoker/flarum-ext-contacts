<?php
namespace Avatar4eg\Contacts\Migration;

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'avatar4eg_contacts',
    function (Blueprint $table) {
        $table->increments('id');
        $table->string('title', 50);
        $table->string('type', 30);
        $table->string('url', 255);
        $table->string('icon', 100)->nullable();
        $table->string('icon_type', 10)->nullable();
        $table->integer('position')->nullable();
    }
);