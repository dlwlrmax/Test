<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\UpdateUserRequest;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function __construct(private UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function user(Request $request): JsonResponse
    {
        $user = Auth::user();
        if($user) {
            unset($user['id']);
            return $this->sendResponse($user, 200);
        }
    }

    public function update(UpdateUserRequest $request): JsonResponse
    {
        try {
            if ($this->userRepository->update($request->all())) {
                return $this->sendResponse('Updated!!!', 201);
            }
            return $this->sendResponse('Update Failed!!!', 500);
        } catch (\Exception $e) {
            return $this->sendResponse($e->getMessage(), 500);
        }
    }


    public function delete(Request $request): JsonResponse
    {
        try {
            if ($this->userRepository->delete()) {
                return $this->sendResponse('Updated!!!', 201);
            }
            return $this->sendResponse('Update Failed!!!', 500);
        } catch (\Exception $e) {
            return $this->sendResponse($e->getMessage(), 500);
        }
    }
}
