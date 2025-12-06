<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\EventRegistration;
use App\Models\Event;
use App\Models\User;

class UserFactory extends Factory
{
    protected $model = EventRegistration::class;

    public function definition()
    {
        return [
            'event_id' => Event::inRandomOrder()->first()->id ?? 1,
            'user_id' => User::inRandomOrder()->first()->id ?? 1,
            'registered_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
