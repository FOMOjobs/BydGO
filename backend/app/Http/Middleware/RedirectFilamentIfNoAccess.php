<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectFilamentIfNoAccess
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if ($user && method_exists($user, 'canAccessFilament') && !$user->canAccessFilament()) {
            return redirect('/'); // przekierowanie na stronę główną
        }

        return $next($request);
    }
}
