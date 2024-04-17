<?php

namespace App\Repositories\Category;

use App\Models\Category;
use App\Repositories\Category\CategoryRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Class TaskRepository.
 */
class CategoryRepository implements CategoryRepositoryInterface
{
    protected $model;
    protected $cache_key = 'cat_list';

    public function __construct(Category $model)
    {
        $this->model = $model;
    }

    /**
     * Get all
     */
    public function all(): Collection|array|null
    {
        $user = Auth::user();
        $cachedData = Cache::get($this->cache_key . '_' . $user?->id);
        if(isset($cachedData)) {
            return json_decode($cachedData, false);
        } else {
            $data = $user->categories;
            Cache::put($this->cache_key . '_' . $user?->id, $data, config('constants.DEFAULT_CACHE_TIME'));
            return $data;
        }
    }

    /**
    * Create category
    */
    public function create(mixed $data): Category
    {
        $user = Auth::user();
        if ($user) {
            DB::beginTransaction();
            try {
                $cat = $this->model->create($data);
                DB::commit();
                Cache::forget($this->cache_key . '_' . $user?->id);
                return $cat;

            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        }
    }

    /**
    * Delete category
    */
    public function delete(int $id): bool
    {
        $user = Auth::user();
        if($user) {
            $cat = $user->categories->find($id);
            if (!$cat) {
                return false;
            }

            DB::beginTransaction();
            try {
                $cat->delete();
                DB::commit();
                Cache::forget($this->cache_key . '_' . $user?->id);
                Cache::tags(['task', 'list', 'user_' . $user?->id])->flush();

                return true;
            } catch (\Exception $e) {

                DB::rollBack();
                throw $e;
            }
        }
    }
}
