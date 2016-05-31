<?php
namespace Avatar4eg\Contacts\Command;

use Avatar4eg\Contacts\Contact;
use Flarum\Core\Access\AssertPermissionTrait;
use Avatar4eg\Contacts\Repository\ContactRepository;
use Avatar4eg\Contacts\Validator\ContactValidator;

class EditContactHandler
{
    use AssertPermissionTrait;

    /**
     * @var ContactRepository
     */
    protected $contacts;

    /**
     * @var ContactValidator
     */
    protected $validator;

    /**
     * @param ContactRepository $contacts
     * @param ContactValidator $validator
     */
    public function __construct(ContactRepository $contacts, ContactValidator $validator)
    {
        $this->contacts = $contacts;
        $this->validator = $validator;
    }

    /**
     * @param EditContact $command
     * @return Contact
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(EditContact $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $contact = $this->contacts->findOrFail($command->contactId, $actor);

        $this->assertAdmin($actor);

        $attributes = array_get($data, 'attributes', []);

        if (isset($attributes['title'])) $contact->title = $attributes['title'];
        if (isset($attributes['url'])) $contact->url = $attributes['url'];
        if (isset($attributes['type'])) $contact->type = $attributes['type'];
        if (isset($attributes['icon'])) $contact->icon = $attributes['icon'];
        if (isset($attributes['icon_type'])) $contact->icon_type = $attributes['icon_type'];

        $this->validator->assertValid($contact->getDirty());

        $contact->save();

        return $contact;
    }
}
