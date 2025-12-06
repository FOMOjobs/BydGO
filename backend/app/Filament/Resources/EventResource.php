<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EventResource\Pages;
use App\Filament\Resources\EventResource\RelationManagers;
use App\Models\Event;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\FileUpload;



use Illuminate\Support\Facades\Auth;
class EventResource extends Resource
{
    protected static ?string $model = Event::class;

    protected static ?string $navigationLabel = 'Wydarzenia';

    // Ikona w menu
    protected static ?string $navigationIcon = 'heroicon-o-users';
    public static function getModelLabel(): string
    {
        return 'Wydarzenia';
    }

    // Nazwa mnoga (dla tabeli itp.)
    public static function getPluralModelLabel(): string
    {
        return 'Wydarzenia';
    }
    // Grupa w menu (opcjonalnie)
    protected static ?string $navigationGroup = 'Zarządzanie';
   

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                ->label('Nazwa')->columnSpan('full')
                ->required()
                ->maxLength(255),

            Textarea::make('description')
                ->label('Opis')
                ->rows(3)->columnSpan('full'),

            DateTimePicker::make('start_date')
                ->label('Data rozpoczęcia')
                ->required(),

            DateTimePicker::make('end_date')
                ->label('Data zakończenia')
                ->required(),

            TextInput::make('address')
                ->label('Adres')
                ->maxLength(255)->columnSpan('full'),
                TextInput::make('latitude')
                ->label('Współrzędne')
                ->numeric()
                ->step(0.0000001),

            TextInput::make('longitude')
                ->label('Współrzędne')
                ->numeric()
                ->step(0.0000001),
            TextInput::make('max_users')
                ->label('Liczba wolontariuszy')
                ->numeric()
                ->required(),

            TextInput::make('hoursperday')
                ->label('Dzienne zaangazowanie')
                ->numeric()
                ->required(),

            TextInput::make('level')
                ->label('Poziom trudności')
                ->maxLength(50),

            Toggle::make('minors')
                ->label('Dostępny dla małoletnich')
                ->default(false)->columnSpan('full'),

            Select::make('user_id')
                ->label('Organizator')
                ->relationship('user', 'name')
                ->required(),

                Select::make('category_id')
                ->label('Kategoria')
                ->relationship('category', 'name')
                ->required(),
         

            FileUpload::make('image1')
                ->label('Foto 1')
                ->image()
                ->directory('events')->columnSpan('full'),

            FileUpload::make('image2')
                ->label('Foto 2')
                ->image()
                ->directory('events'),

            FileUpload::make('image3')
                ->label('Foto 3')
                ->image()
                ->directory('events'),

            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([

                TextColumn::make('registrations_count')
                ->label('Zarejestrowanych')
                ->counts('registrations')
                ->formatStateUsing(fn($state, $record) => "{$state} / {$record->max_users}")
                ->sortable(),
                TextColumn::make('title')->label('Tytuł')->sortable()->searchable(),
                TextColumn::make('start_date')->label('Data od')->dateTime()->sortable(),
                TextColumn::make('end_date')->label('Data do')->dateTime()->sortable(),
                TextColumn::make('address')->label('Adres')->sortable()->searchable(),
                TextColumn::make('max_users')->label('Maks wolontariuszy')->sortable(),
                TextColumn::make('hoursperday')->label('Godzin dziennie')->sortable(),
                TextColumn::make('level')->label('Poziom trudności')->sortable(),
                TextColumn::make('minors')->label('Niepełnoletni')->formatStateUsing(fn($state) => $state ? 'Yes' : 'No'),
                TextColumn::make('user.name')->label('Organizator')->sortable()->searchable(),
                TextColumn::make('category.name')->label('Kategoria')->sortable()->searchable(),
                ImageColumn::make('image1')->label('Foto 1')->rounded(),
                ImageColumn::make('image2')->label('Foto 2')->rounded(),
                ImageColumn::make('image3')->label('Foto 3')->rounded(),
                TextColumn::make('created_at')->label('Data utworzenia')->dateTime()->sortable(),
               

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
    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();

        $user = Auth::user();

        // jeśli user_id != 1, pokazujemy tylko jego eventy
        if ($user->id !== 1) {
            $query->where('user_id', $user->id);
        }

        return $query;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEvents::route('/'),
            'create' => Pages\CreateEvent::route('/create'),
            'edit' => Pages\EditEvent::route('/{record}/edit'),
        ];
    }
    public static function getNavigationBadge(): ?string
{
    return (string) static::getModel()::count();
}
}
