<?php
namespace Avatar4eg\Contacts\Listener;

use Flarum\Api\Controller\ShowForumController;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Event\ConfigureApiController;
use Flarum\Event\GetApiRelationship;
use Flarum\Event\PrepareApiData;
use Flarum\Settings\SettingsRepositoryInterface;
use Avatar4eg\Contacts\Api\Serializer\ContactSerializer;
use Avatar4eg\Contacts\Contact;
use Illuminate\Contracts\Events\Dispatcher;

class AddContactsRelationship
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @param SettingsRepositoryInterface $settings
     */
    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(GetApiRelationship::class, [$this, 'GetApiRelationship']);
        $events->listen(PrepareApiData::class, [$this, 'PrepareApiData']);
        $events->listen(ConfigureApiController::class, [$this, 'includeContactsRelationship']);
    }

    /**
     * @param GetApiRelationship $event
     * @return \Tobscure\JsonApi\Relationship|null
     */
    public function GetApiRelationship(GetApiRelationship $event)
    {
        if ($event->isRelationship(ForumSerializer::class, 'contacts')) {
            return $event->serializer->hasMany($event->model, ContactSerializer::class, 'contacts');
        }
    }

    /**
     * @param PrepareApiData $event
     */
    public function PrepareApiData(PrepareApiData $event)
    {
        if ($event->isController(ShowForumController::class)) {
            $event->data['contacts'] = Contact::get();
        }
    }

    /**
     * @param ConfigureApiController $event
     */
    public function includeContactsRelationship(ConfigureApiController $event)
    {
        if ($event->isController(ShowForumController::class)) {
            $event->addInclude(['contacts']);
        }
    }
}
