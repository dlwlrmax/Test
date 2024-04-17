<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterUserRequest;
use App\Repositories\User\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
    public function __construct(private UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(RegisterUserRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {

            $input = $request->all();
            $input['password'] = bcrypt($input['password']);
            $user = $this->userRepository->create($input);
            $success = [
                'token' => $user->createToken('Token')->accessToken,
                'name' => $user->name
            ];
            DB::commit();

            return $this->sendResponse($success, 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendResponse($e->getMessage(), 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if(Auth::attempt($request->only(['email', 'password']))) {
            $user = Auth::user();

            $success = [
                'token' => $user->createToken('Token')->accessToken,
                'name' => $user->name
            ];

            return $this->sendResponse($success, 200);
        } else {
            return $this->sendResponse(['errors' => ['email' => 'Invalid login']], 401);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        if(Auth::user()) {
            $request->user()->token()->revoke();

            return $this->sendResponse('Logged out!!!', 200);
        }
    }
}
