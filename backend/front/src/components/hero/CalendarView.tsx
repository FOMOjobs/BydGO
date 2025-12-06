import { useState } from 'react';
import { useVolunteerStore } from '@/stores/volunteerStore';
import { VolunteerCategory } from '@/types/volunteer.types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const getCategoryDotColor = (category: VolunteerCategory): string => {
  const colors = {
    education: 'bg-[#5B4B9C]',
    ecology: 'bg-[#8BC53F]',
    sport: 'bg-[#FF9500]',
    culture: 'bg-[#E91E8C]',
    social: 'bg-[#FF6B9D]',
    health: 'bg-[#EF4444]'
  };
  return colors[category] || 'bg-gray-400';
};

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date): number => {
  const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return day === 0 ? 7 : day; // Convert Sunday from 0 to 7
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
};

const formatMonth = (date: Date): string => {
  return date.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
};

export const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { opportunities } = useVolunteerStore();
  
  // Get opportunities for current month
  const monthOpportunities = opportunities.filter(opp => {
    const oppDate = new Date(opp.date.start);
    return oppDate.getMonth() === currentMonth.getMonth() &&
           oppDate.getFullYear() === currentMonth.getFullYear();
  });

  // Get next 5 upcoming
  const upcomingEvents = opportunities
    .filter(opp => new Date(opp.date.start) > new Date())
    .slice(0, 5);

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="w-full h-full bg-white p-6 overflow-y-auto">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 capitalize">
          {formatMonth(currentMonth)}
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={previousMonth}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={nextMonth}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {/* Day headers */}
        {['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* Days */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const dayOpportunities = monthOpportunities.filter(
            opp => new Date(opp.date.start).getDate() === day
          );
          const isToday = isSameDay(date, new Date());
          
          return (
            <div
              key={day}
              className={`aspect-square p-1 rounded-lg border ${
                isToday ? 'border-primary bg-primary/10' : 'border-gray-200'
              } ${dayOpportunities.length > 0 ? 'bg-green-50' : ''}`}
            >
              <div className="text-xs font-semibold text-gray-700 text-center">
                {day}
              </div>
              {/* Category dots */}
              {dayOpportunities.length > 0 && (
                <div className="flex justify-center gap-1 mt-1 flex-wrap">
                  {dayOpportunities.slice(0, 3).map((opp, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${getCategoryDotColor(opp.category)}`}
                      title={opp.title}
                    />
                  ))}
                  {dayOpportunities.length > 3 && (
                    <div className="text-[8px] text-gray-500">+{dayOpportunities.length - 3}</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming events list */}
      <div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">
          📅 Najbliższe wydarzenia
        </h4>
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              onClick={() => window.location.href = `/opportunities/${event.id}`}
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${getCategoryDotColor(event.category)}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">
                  {event.title}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(event.date.start).toLocaleDateString('pl-PL')} • {event.timeCommitment}
                </p>
              </div>
              <Button
                size="sm"
                className="text-xs bg-primary text-white px-3 py-1 rounded-lg hover:bg-primary/90 transition flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle quick apply
                }}
              >
                Aplikuj
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
