<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ValidateCategoryRequest;
use App\Repositories\Category\CategoryRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function __construct(private CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function index(Request $request): JsonResponse
    {
        $data = $this->categoryRepository->all();
        if($data) {
            return $this->sendResponse($data, 200);
        }
        return $this->sendResponse('No resouce found!!!', 404);
    }

    public function create(ValidateCategoryRequest $request): JsonResponse
    {
        $user = Auth::user();
        $data = $request->all();
        $data['user_id'] = $user->id;
        try {

            $cat = $this->categoryRepository->create($data);
            return $this->sendResponse($data, 200);
        } catch(\Exception $e) {
            return $this->sendResponse($e->getMessage(), 500);
        }
    }

    public function delete(int $id): JsonResponse
    {
        try {
            $result = $this->categoryRepository->delete($id);

            if($result) {
                return $this->sendResponse('Deleted!!!');
            } else {
                return $this->sendResponse('No resouce found !!!!', 404);
            }
        } catch (\Exception $e) {
            return $this->sendResponse($e->getMessage(), 500);
        }
    }
}
