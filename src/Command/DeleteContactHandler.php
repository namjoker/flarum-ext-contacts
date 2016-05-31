<?php
namespace Avatar4eg\Contacts\Command;

use Avatar4eg\Contacts\Contact;
use Flarum\Core\Access\AssertPermissionTrait;
use Avatar4eg\Contacts\Repository\ContactRepository;

class DeleteContactHandler
{
    use AssertPermissionTrait;

    /**
     * @var ContactRepository
     */
    protected $contacts;

    /**
     * @param ContactRepository $contacts
     */
    public function __construct(ContactRepository $contacts)
    {
        $this->contacts = $contacts;
    }

    /**
     * @param DeleteContact $command
     * @return Contact
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(DeleteContact $command)
    {
        $actor = $command->actor;

        $contact = $this->contacts->findOrFail($command->contactId, $actor);

        $this->assertAdmin($actor);

        $contact->delete();

        return $contact;
    }
}
