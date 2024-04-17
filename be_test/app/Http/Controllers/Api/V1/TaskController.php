<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ValidateTaskRequest;
use App\Repositories\Tasks\TaskRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function __construct(private TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $IS_GROUP = true;
        $user = Auth::user();
        $data = $this->taskRepository->getByUser($user?->id, $request->all(), $IS_GROUP);
        return $this->sendResponse($data, 200);
    }

    public function detail(int $id): JsonResponse
    {
        $task = $this->taskRepository->get($id);
        if($task) {
            return $this->sendResponse($task, 200);
        }
        return $this->sendResponse('No resouce found!!!', 404);
    }

    public function edit(int $id, ValidateTaskRequest $request): JsonResponse
    {
        try {
            if($this->taskRepository->edit($id, $request->all())) {
                return $this->sendResponse('Updated!!!', 200);
            } else {
                return $this->sendResponse('No resouce found!!!', 404);
            }
        } catch (\Exception $e) {
            return $this->sendResponse($e->getMessage(), 500);
        }
    }

    public function create(ValidateTaskRequest $request): JsonResponse
    {
        try {
            $task = $this->taskRepository->create($request->all());

            return $this->sendResponse('Created!!!', 201);
        } catch(\Exception $e) {

            return $this->sendResponse($e->getMessage(), 500);
        }
    }

    public function delete(int $id): JsonResponse
    {
        try {
            if($this->taskRepository->delete($id)) {
                return $this->sendResponse('Deleted!!!', 201);
            } else {
                return $this->sendResponse('No resouce found!!!', 404);
            }

        } catch(\Exception $e) {

            return $this->sendResponse($e->getMessage(), 500);
        }
    }
}
