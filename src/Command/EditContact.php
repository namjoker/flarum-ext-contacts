<?php
namespace Avatar4eg\Contacts\Command;

use Flarum\Core\User;

class EditContact
{
    /**
     * The ID of the contact to edit.
     *
     * @var int
     */
    public $contactId;

    /**
     * The user performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * The attributes to update on the contact.
     *
     * @var array
     */
    public $data;

    /**
     * @param int $contactId The ID of the contact to edit.
     * @param User $actor The user performing the action.
     * @param array $data The attributes to update on the contact.
     */
    public function __construct($contactId, User $actor, array $data)
    {
        $this->contactId = $contactId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
