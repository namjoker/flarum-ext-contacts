<?php
namespace Avatar4eg\Contacts\Repository;

use Avatar4eg\Contacts\Contact;
use Flarum\Core\User;

class ContactRepository
{
    /**
     * @param array $where
     * @param array $sort
     * @param integer $count
     * @param integer $start
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findWhere(array $where = [], $sort = [], $count = null, $start = 0)
    {
        $query = Contact::where($where)
            ->skip($start)
            ->take($count);

        foreach ((array) $sort as $field => $order) {
            $query->orderBy($field, $order);
        }

        $ids = $query->lists('id')->all();

        return $this->findByIds($ids);
    }

    /**
     * @param array $ids
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function findByIds(array $ids)
    {
        return Contact::whereIn('id', $ids)->get();
    }

    /**
     * Find a contact by ID
     *
     * @param int $id
     * @param User $actor
     * @return Contact
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail($id, User $actor = null)
    {
        return Contact::where('id', $id)->firstOrFail();
    }

    /**
     * Get all contacts
     *
     * @param User|null $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all()
    {
        return Contact::newQuery();
    }
}
