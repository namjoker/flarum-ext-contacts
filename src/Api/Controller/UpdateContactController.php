<?php
namespace Avatar4eg\Contacts\Api\Controller;

use Flarum\Api\Controller\AbstractResourceController;
use Avatar4eg\Contacts\Api\Serializer\ContactSerializer;
use Avatar4eg\Contacts\Command\EditContact;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UpdateContactController extends AbstractResourceController
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
        $id = array_get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $data = array_get($request->getParsedBody(), 'data');

        return $this->bus->dispatch(
            new EditContact($id, $actor, $data)
        );
    }
}
