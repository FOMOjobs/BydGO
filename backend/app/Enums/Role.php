<?php
namespace App\Enums;

enum Role: string {
    case Wolontariusz = 'Wolontariusz';
    case Organizacja = 'Organizacja';
    case Koordynator = 'Koordynator';
}