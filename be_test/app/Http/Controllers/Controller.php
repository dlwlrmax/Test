<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function sendResponse($data, $code = 200)
    {
        return response()->json($data, $code);
    }
}
