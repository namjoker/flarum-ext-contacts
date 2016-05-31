<?php
namespace Avatar4eg\Contacts;

use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property string $title
 * @property string $type
 * @property string $url
 * @property string $icon
 * @property string $icon_type
 * @property int $position
 */
class Contact extends AbstractModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'avatar4eg_contacts';

    /**
     * Create a new contact.
     *
     * @param string $name
     * @param string $url
     * @param string $type
     * @param string $icon
     * @param string $icon_type
     * @return static
     */
    public static function build($name, $url, $type = null, $icon = null, $icon_type = null)
    {
        $contact = new static;

        $contact->title     = $name;
        $contact->url       = $url;
        $contact->type      = $type ?: 'url';
        $contact->icon      = $icon ?: 'fa-link';
        $contact->icon_type = $icon_type ?: 'icon';

        return $contact;
    }
}