<?php
namespace Avatar4eg\Contacts;

use Illuminate\Contracts\Events\Dispatcher;

return function (Dispatcher $events) {
    $events->subscribe(Listener\AddClientAssets::class);
    $events->subscribe(Listener\AddContactsApi::class);
    $events->subscribe(Listener\AddContactsRelationship::class);
};