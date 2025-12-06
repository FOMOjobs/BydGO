<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class StatsController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/stats/events",
     *     tags={"Statystyki"},
     *     summary="Pobierz listę wydarzeń wraz z liczbą rejestracji",
     *     description="Zwraca listę wydarzeń wraz z liczbą rejestracji. Użyj ?format=csv, aby pobrać dane w formacie CSV. Opcjonalne parametry zapytania: from, to (YYYY-MM-DD).",
     *     @OA\Parameter(
     *         name="from",
     *         in="query",
     *         description="Data rozpoczęcia (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="to",
     *         in="query",
     *         description="Data zakończenia (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="format",
     *         in="query",
     *         description="Format odpowiedzi (json lub csv)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"json","csv"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Lista wydarzeń z liczbą rejestracji",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="tytul", type="string", example="Karmienie tygrysa"),
     *                 @OA\Property(property="liczba_rejestracji", type="integer", example=12),
     *                 @OA\Property(property="maks_uczestnikow", type="integer", example=23)
     *             )
     *         )
     *     )
     * )
     */
    public function eventsCount(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $query = Event::withCount('registrations');

        if ($from) {
            $query->whereDate('start_date', '>=', $from);
        }

        if ($to) {
            $query->whereDate('end_date', '<=', $to);
        }

        $data = $query->get()
            ->map(fn($event) => [
                'tytul' => $event->title,
                'liczba_rejestracji' => $event->registrations_count,
                'maks_uczestnikow' => $event->max_users
            ])
            ->toArray();

        if ($request->query('format') === 'csv') {
            $response = new StreamedResponse(function () use ($data) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['tytul', 'liczba_rejestracji']);
                foreach ($data as $row) {
                    fputcsv($handle, $row);
                }
                fclose($handle);
            });

            $response->headers->set('Content-Type', 'text/csv');
            $response->headers->set('Content-Disposition', 'attachment; filename="events_count.csv"');

            return $response;
        }

        return response()->json($data);
    }

    /**
     * @OA\Get(
     *     path="/api/stats/users",
     *     tags={"Statystyki"},
     *     summary="Get user count grouped by role",
     *     description="Returns the number of users grouped by their role. Use ?format=csv to download as CSV. Optional query parameters: from, to (YYYY-MM-DD).",
     *     @OA\Parameter(
     *         name="from",
     *         in="query",
     *         description="Start date filter (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="to",
     *         in="query",
     *         description="End date filter (YYYY-MM-DD)",
     *         required=false,
     *         @OA\Schema(type="string", format="date")
     *     ),
     *     @OA\Parameter(
     *         name="format",
     *         in="query",
     *         description="Response format (json or csv)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"json","csv"})
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of user counts by role",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(
     *                 type="object",
     *                 @OA\Property(property="rola", type="string", example="Wolontariusz"),
     *                 @OA\Property(property="liczba_uzytkownikow", type="integer", example=12)
     *             )
     *         )
     *     )
     * )
     */
    public function usersCount(Request $request)
    {
        $from = $request->query('from');
        $to = $request->query('to');

        $query = User::select('role as rola')
            ->selectRaw('COUNT(*) as liczba_uzytkownikow');

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $data = $query->groupBy('role')->get()->toArray();

        if ($request->query('format') === 'csv') {
            $response = new StreamedResponse(function () use ($data) {
                $handle = fopen('php://output', 'w');
                fputcsv($handle, ['rola', 'liczba_uzytkownikow']);
                foreach ($data as $row) {
                    fputcsv($handle, $row);
                }
                fclose($handle);
            });

            $response->headers->set('Content-Type', 'text/csv');
            $response->headers->set('Content-Disposition', 'attachment; filename="users_count.csv"');

            return $response;
        }

        return response()->json($data);
    }
}
