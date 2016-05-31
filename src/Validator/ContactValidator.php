<?php
namespace Avatar4eg\Contacts\Validator;

use Flarum\Core\Validator\AbstractValidator;

class ContactValidator extends AbstractValidator
{
    /**
     * {@inheritdoc}
     */
    protected $rules = [
        'title' => ['required'],
        'url'   => ['required']
    ];
}
