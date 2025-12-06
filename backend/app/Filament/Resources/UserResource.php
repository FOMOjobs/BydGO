<?php

namespace App\Filament\Resources;
use App\Enums\Role;
use App\Filament\Resources\UserResource\Pages;
use App\Filament\Resources\UserResource\RelationManagers;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DatePicker;
use Carbon\Carbon;
class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationLabel = 'Użytkownicy';

    // Ikona w menu
    protected static ?string $navigationIcon = 'heroicon-o-users';
    public static function getModelLabel(): string
    {
        return 'Użytkownik';
    }

    // Nazwa mnoga (dla tabeli itp.)
    public static function getPluralModelLabel(): string
    {
        return 'Użytkownicy';
    }
    // Grupa w menu (opcjonalnie)
    protected static ?string $navigationGroup = 'Zarządzanie';
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                ->label('Imię i nazwisko')
                ->required()
                ->maxLength(255),

            TextInput::make('email')
                ->label('E-mail')
                ->email()
                ->required()
                ->unique(ignoreRecord: true), // unikalny e-mail

                TextInput::make('password')
                ->label('Hasło')
                ->password()
                ->required(fn ($livewire) => $livewire instanceof \Filament\Resources\Pages\CreateRecord)
                ->dehydrateStateUsing(fn ($state) => $state ? bcrypt($state) : null)
                ->dehydrated(fn ($state) => !empty($state))
                ->visible(fn ($livewire) => $livewire instanceof \Filament\Resources\Pages\CreateRecord),
            
                DatePicker::make('dob')
    ->label('Data urodzenia')
    ->required()->format('Y-m-d')
    ->maxDate(now()),
    Select::make('role')
    ->label('Rola')
    ->options(
        collect(Role::cases())->mapWithKeys(fn($case) => [$case->value => $case->value])->toArray()
    )
    ->required()
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('pelnoletni')
    ->label('Pełnoletni')
    ->getStateUsing(function ($record) {
        if (!$record->dob) return 'Brak daty';
        return Carbon::parse($record->dob)->age >= 18 ? 'Tak' : 'Nie';
    })->extraAttributes(fn ($record) => [
        'class' => $record->dob && \Carbon\Carbon::parse($record->dob)->age < 18
            ? 'bg-yellow-100'
            : '',
    ])
    ->sortable(), // opcjonalnie
               
                BadgeColumn::make('role')->label('Rola')
                ->colors([
                    'primary' => 'Wolontariusz',
                    'success' => 'Organizacja',
                    'warning' => 'Koordynator',
                ]),
                TextColumn::make('name')->label('Imię i nazwisko')->sortable()->searchable(),
                TextColumn::make('email')->sortable()->searchable(),
                TextColumn::make('dob')->label('Data urodzenia')  ->date('Y-m-d')->sortable()->searchable()
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
    public static function getNavigationBadge(): ?string
{
    return (string) static::getModel()::count();
}
}
