<?php

namespace App\Filament\Resources;

use App\Filament\Resources\EventRegistrationResource\Pages;
use App\Models\EventRegistration;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\DateTimePicker;
use Filament\Tables\Columns\TextColumn;

class EventRegistrationResource extends Resource
{
    public static function canViewAny(): bool
    {
        return auth()->user()->id==1;
    }
    protected static ?string $navigationLabel = 'Zapisy';
    protected static ?string $model = EventRegistration::class;
   // protected static ?string $navigationLabel = 'Event Registrations';
    protected static ?string $navigationIcon = 'heroicon-o-academic-cap';
    protected static ?string $navigationGroup = 'Zarządzanie';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('event_id')
                    ->label('Event')
                    ->relationship('event', 'title')
                    ->required(),

                Select::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->required(),

                DateTimePicker::make('registered_at')
                    ->label('Registration Time')
                    ->default(now())
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('event.title')->label('Event')->sortable()->searchable(),
                TextColumn::make('user.name')->label('User')->sortable()->searchable(),
                TextColumn::make('registered_at')->label('Registration Time')->dateTime()->sortable(),
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
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListEventRegistrations::route('/'),
            'create' => Pages\CreateEventRegistration::route('/create'),
            'edit' => Pages\EditEventRegistration::route('/{record}/edit'),
        ];
    }
}
