<?php
namespace Avatar4eg\Contacts\Api\Controller;

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Http\Controller\ControllerInterface;
use Avatar4eg\Contacts\Contact;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\EmptyResponse;

class OrderContactsController implements ControllerInterface
{
    use AssertPermissionTrait;

    /**
     * {@inheritdoc}
     */
    public function handle(ServerRequestInterface $request)
    {
        $this->assertAdmin($request->getAttribute('actor'));

        $order = array_get($request->getParsedBody(), 'order');

        foreach ($order as $i => $contact) {
            Contact::where('id', $contact['id'])->update(['position' => $i]);
        }

        return new EmptyResponse(204);
    }
}
