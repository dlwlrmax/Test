<?php

namespace App\Repositories\Tasks;

use App\Models\Task;
use App\Repositories\Tasks\TaskRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

/**
 * Class TaskRepository.
 */
class TaskRepository implements TaskRepositoryInterface
{
    protected $model;
    protected $cache_key = "task_page_";

    public function __construct(Task $model)
    {
        $this->model = $model;
    }

    /**
    * Get all
    * @return Array
    */
    public function getByUser(int $userId, mixed $request, bool $isGroup = false): LengthAwarePaginator
    {
        $key = $this->cache_key . '_' . $userId . $request['page'];
        $data = Cache::get($key);
        if(!isset($data)) {
            $perpage = $request['per_page'] ?? config('constants.DEFAULT_PER_PAGE');
            $data = $this->model->leftJoin('categories', 'categories.id', 'tasks.categories_id')
                ->where('tasks.user_id', $userId)
                ->select([
                    'tasks.*',
                    'categories.name'
                ])
                ->orderBy('categories.name')
                ->paginate($perpage);

            if ($isGroup) {
                $data->setCollection($data->groupBy('name'));
            }
            Cache::tags(['task', 'list', 'user_' . $userId])->put($key, $data);
        }
        return $data;
    }

    /**
    * Create task
    */
    public function create(mixed $data): Task
    {
        $user = Auth::user();
        DB::beginTransaction();
        try {
            $data['user_id'] = $user->id;
            $task = $this->model->create($data);
            DB::commit();

            Cache::tags(['task', 'list', 'user_' . $user->id])->flush();
            return $task;
        } catch(\Exception $e) {

            DB::rollBack();
            throw $e;
        }
    }

    /**
    * Get detail
    */
    public function get(int $id): Task|null
    {
        $user = Auth::user();
        return $user->tasks->find($id);
    }


    /**
    * Edit task
    */
    public function edit(int $id, mixed $data): Task|null
    {
        $user = Auth::user();
        $task = $user->tasks->find($id);
        if ($task) {
            $task->update($data);
        }
        Cache::tags(['task', 'list', 'user_' . $user->id])->flush();
        return $task;
    }

    /**
    * Delete task
    */
    public function delete(int $id): bool
    {
        $user = Auth::user();
        $task = $user->tasks->find($id);
        if (!$task) {
            return  false;
        }

        DB::beginTransaction();
        try {
            $task->delete();
            DB::commit();

            Cache::tags(['task', 'list', 'user_' . $user->id])->flush();
            return true;
        } catch (\Exception $e) {

            DB::rollBack();
            throw $e;
        }

    }
}
