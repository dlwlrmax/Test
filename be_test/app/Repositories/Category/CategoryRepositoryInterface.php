<?php

namespace App\Repositories\Category;

use App\Models\Category;
use Illuminate\Support\Collection;


interface CategoryRepositoryInterface
{
    public function create(mixed $data): Category;

    public function all(): Collection|array|null;

    public function delete(int $id): bool;
}
