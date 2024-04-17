<?php

namespace App\Repositories\User;

use App\Models\User;

interface UserRepositoryInterface {

    public function get():User|null;

    public function create(mixed $data): User|null;

    public function update($data): int|bool;

    public function delete(): int|bool;

}
