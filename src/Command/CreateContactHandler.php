<?php
namespace Avatar4eg\Contacts\Command;

use Flarum\Core\Access\AssertPermissionTrait;
use Avatar4eg\Contacts\Contact;
use Avatar4eg\Contacts\Validator\ContactValidator;

class CreateContactHandler
{
    use AssertPermissionTrait;

    /**
     * @var ContactValidator
     */
    protected $validator;

    /**
     * @param ContactValidator $validator
     */
    public function __construct(ContactValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param CreateContact $command
     * @return Contact
     */
    public function handle(CreateContact $command)
    {
        $actor = $command->actor;
        $data = $command->data;

        $this->assertAdmin($actor);

        $contact = Contact::build(
            array_get($data, 'attributes.title'),
            array_get($data, 'attributes.url'),
            array_get($data, 'attributes.type'),
            array_get($data, 'attributes.icon'),
            array_get($data, 'attributes.icon_type')
        );

        $this->validator->assertValid($contact->getAttributes());

        $contact->save();

        return $contact;
    }
}
