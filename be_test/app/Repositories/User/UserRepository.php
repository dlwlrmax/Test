<?php

namespace App\Repositories\User;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

/**
 * Class TaskRepository.
 */
class UserRepository implements UserRepositoryInterface
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    /**
    * Get all
    * @return User|null
    */
    public function get(): User|null
    {
        return $this->model->get();
    }

    /**
    * Create new user
    * @return User
    */
    public function create($data) : User
    {
        return $this->model->create($data);
    }

    /**
    * Update user
    * @return int|bool
    */
    public function update($data): int|bool
    {
        DB::beginTransaction();
        $user = Auth::user();
        try {

            if($user) {
                if ($this->model->where('id', $user->id)->update($data)) {

                    DB::commit();

                    return true;
                }
                DB::rollBack();
            }
            return false;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
    * Update user
    * @return int|bool
    */
    public function delete(): int|bool
    {
        DB::beginTransaction();
        $user = Auth::user();
        try {
            if($user) {
                if ($this->model->where('id', $user->id)->delete()) {

                    DB::commit();

                    return true;
                }
                DB::rollBack();
            }
            return false;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
