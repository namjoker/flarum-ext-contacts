<?php
namespace Avatar4eg\Contacts\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Avatar4eg\Contacts\Command\DeleteContact;
use Illuminate\Contracts\Bus\Dispatcher;
use Psr\Http\Message\ServerRequestInterface;

class DeleteContactController extends AbstractDeleteController
{
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
    protected function delete(ServerRequestInterface $request)
    {
        $this->bus->dispatch(
            new DeleteContact(array_get($request->getQueryParams(), 'id'), $request->getAttribute('actor'))
        );
    }
}
