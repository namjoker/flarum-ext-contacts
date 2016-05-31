<?php
namespace Avatar4eg\Contacts\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Avatar4eg\Contacts\Api\Serializer\ContactSerializer;
use Avatar4eg\Contacts\Command\CreateContact;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class CreateContactController extends AbstractCreateController
{
    /**
     * @inheritdoc
     */
    public $serializer = ContactSerializer::class;

    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return $this->bus->dispatch(
            new CreateContact($request->getAttribute('actor'), array_get($request->getParsedBody(), 'data'))
        );
    }
}
