<?php

namespace App\Traits;

trait ApiUtilsTrait
{
    public function truncateTitle($sentence, $character_limit = 80)
    {
        if (strlen($sentence) <= $character_limit) {
            return $sentence;
        }

        // Find the position of the last space within the first $character_limit characters
        $lastSpace = strrpos(substr($sentence, 0, $character_limit), ' ');

        if ($lastSpace !== false) {
            // Truncate the sentence at the last space position
            $truncated = substr($sentence, 0, $lastSpace);
        } else {
            // If there is no space within the first 80 characters, simply truncate at the 80th character
            $truncated = substr($sentence, 0, $character_limit);
        }

        return $truncated;
    }
    public function separateName($name): array
    {
        if (!$name) {
            return [
                'first_name' => '',
                'last_name' => '',
            ];
        }
        $name = rtrim($name);
        $nameParts = preg_split('/\s+/', $name); // Split the name into an array of words
        $lastName = array_pop($nameParts); // Remove and get the last word as the last name
        $firstName = implode(" ", $nameParts); // Rejoin the remaining words as the first name
        return [
            'first_name' => $firstName,
            'last_name' => $lastName,
        ];
    }

    public function getDateDifference($date, $date2)
    {
        if (!$date || !$date2  || $date > $date2) {
            return 0;
        }
        $timestamp1 = strtotime($date);
        $timestamp2 = strtotime($date2);
        $diffInSeconds = abs($timestamp2 - $timestamp1);
        return floor($diffInSeconds / (60 * 60 * 24));
    }

    public function dateDiffInDays($date1, $date2)
    {
        $diff = strtotime($date2) - strtotime($date1);
        return round($diff / 86400);
    }

}
