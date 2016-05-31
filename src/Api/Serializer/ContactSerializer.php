<?php
namespace Avatar4eg\Contacts\Api\Serializer;

use Avatar4eg\Contacts\Contact;
use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Core\Access\Gate;
use InvalidArgumentException;

class ContactSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'contacts';

    /**
     * {@inheritdoc}
     * 
     * @param Contact $contact
     * @throws InvalidArgumentException
     */
    protected function getDefaultAttributes($contact)
    {
        if (! ($contact instanceof Contact)) {
            throw new InvalidArgumentException(get_class($this)
                . ' can only serialize instances of ' . Contact::class);
        }

        $attributes = [
            'id'        => $contact->id,
            'title'     => $contact->title,
            'type'      => $contact->type,
            'url'       => $contact->url,
            'icon'      => $contact->icon,
            'icon_type' => $contact->icon_type,
            'position'  => $contact->position,
        ];

        return $attributes;
    }
}
