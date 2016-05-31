<?php
namespace Avatar4eg\Contacts\Api\Controller;

use Avatar4eg\Contacts\Api\Serializer\ContactSerializer;
use Avatar4eg\Contacts\Repository\ContactRepository;
use Flarum\Api\Controller\AbstractCollectionController;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListContactsController extends AbstractCollectionController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = ContactSerializer::class;

    /**
     * @var ContactRepository
     */
    private $contacts;

    /**
     * @param ContactRepository $contacts
     */
    public function __construct(ContactRepository $contacts)
    {
        $this->contacts = $contacts;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $filter = $this->extractFilter($request);
        $include = $this->extractInclude($request);
        $where = [];

        if ($postIds = array_get($filter, 'id')) {
            $contacts = $this->contacts->findByIds(explode(',', $postIds));
        } else {
            if ($type = array_get($filter, 'type')) {
                $where['type'] = $type;
            }

            $sort = $this->extractSort($request);
            $limit = $this->extractLimit($request);
            $offset = $this->extractOffset($request);
            $contacts = $this->contacts->findWhere($where, $sort, $limit, $offset);
        }

        return $contacts->load($include);
    }
}
