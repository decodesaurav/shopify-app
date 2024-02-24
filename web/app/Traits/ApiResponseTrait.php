<?php

namespace App\Traits;

trait ApiResponseTrait
{
    public function successResponse($data = null)
    {
        $result = array(
            'status' => 'success',
            'success' => true
        );
        if (!is_null($data)) {
            $result['result'] = $data;
        }
        return response($result, 200);
    }

    public function errorResponse($status_code = 500, $error_message = null)
    {
        $result = [
            'success' => false
        ];

        if ($error_message !== null) {
            $result['message'] = $error_message;
        }

        return response($result, $status_code);
    }
}
