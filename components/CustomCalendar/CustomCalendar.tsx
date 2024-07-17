import React from 'react';
import dynamic from 'next/dynamic';
import { CalendarProps } from 'react-calendar';
import { addDays } from 'date-fns';
import 'react-calendar/dist/Calendar.css';
import { CustomCalendarProps } from './CustomCalendar.types';

const DynamicCalendar = dynamic(() => import('react-calendar'), { ssr: false });

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onChange,
}) => {
  const handleDateChange: CalendarProps['onChange'] = (value) => {
    if (Array.isArray(value)) {
      onChange(value[0]);
    } else {
      onChange(value);
    }
  };

  return (
    <div className="calendar-container">
      <DynamicCalendar
        onChange={handleDateChange}
        value={selectedDate}
        minDate={addDays(new Date(), 1)}
        locale="ko"
        className="custom-calendar"
        formatDay={(locale, date) => date.getDate().toString()}
      />
    </div>
  );
};

export default CustomCalendar;
