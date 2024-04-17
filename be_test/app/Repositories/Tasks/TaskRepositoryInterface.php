<?php

namespace App\Repositories\Tasks;

use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface TaskRepositoryInterface
{
    public function getByUser(int $userId, mixed $request, bool $isGroup = false): LengthAwarePaginator;

    public function create(mixed $data): Task;

    public function get(int $id): Task|null;

    public function edit(int $id,mixed $data): Task|null;

    public function delete(int $id): bool;
}
