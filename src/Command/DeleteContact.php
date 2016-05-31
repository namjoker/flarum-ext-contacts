<?php
namespace Avatar4eg\Contacts\Command;

use Flarum\Core\User;

class DeleteContact
{
    /**
     * The ID of the contact to delete.
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
     * Any other contact input associated with the action. This is unused by
     * default, but may be used by extensions.
     *
     * @var array
     */
    public $data;

    /**
     * @param int $contactId The ID of the contact to delete.
     * @param User $actor The user performing the action.
     * @param array $data Any other contact input associated with the action. This
     *     is unused by default, but may be used by extensions.
     */
    public function __construct($contactId, User $actor, array $data = [])
    {
        $this->contactId = $contactId;
        $this->actor = $actor;
        $this->data = $data;
    }
}
