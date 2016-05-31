<?php
namespace Avatar4eg\Contacts\Listener;

use Avatar4eg\Contacts\Api\Controller\ListContactsController;
use Avatar4eg\Contacts\Api\Controller\CreateContactController;
use Avatar4eg\Contacts\Api\Controller\OrderContactsController;
use Avatar4eg\Contacts\Api\Controller\UpdateContactController;
use Avatar4eg\Contacts\Api\Controller\DeleteContactController;
use Flarum\Event\ConfigureApiRoutes;
use Illuminate\Events\Dispatcher;

class AddContactsApi
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
    }

    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->get('/contacts', 'avatar4eg.contacts.index', ListContactsController::class);
        $event->post('/contacts', 'avatar4eg.contacts.create', CreateContactController::class);
        $event->post('/contacts/order', 'avatar4eg.contacts.order', OrderContactsController::class);
        $event->patch('/contacts/{id}', 'avatar4eg.contacts.update', UpdateContactController::class);
        $event->delete('/contacts/{id}', 'avatar4eg.contacts.delete', DeleteContactController::class);
    }
}
