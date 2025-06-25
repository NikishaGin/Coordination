import React, { useState, useRef, useEffect, memo } from "react";
import styled from "styled-components";
import { Calendar } from "lucide-react";

const DateCellContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  position: relative;
`;

const DateText = styled.span`
  color: ${props => props.hasDate ? '#e0e0e0' : '#666'};
  flex: 1;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #a0a0a0;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

const DatePickerContainer = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 10;
  background-color: #2a2a40;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  padding: 12px;
  width: 280px;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DatePickerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MonthNavButton = styled.button`
  background: none;
  border: none;
  color: #a0a0a0;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: #3a3a50;
    color: #ffffff;
  }
`;

const MonthYearDisplay = styled.div`
  color: #ffffff;
  font-weight: 500;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 4px 0;
`;

const DayCell = styled.button`
  background: ${props => props.isSelected ? '#4a4a8c' : 'none'};
  border: none;
  border-radius: 4px;
  color: ${props =>
    props.isToday ? '#a0d0ff' :
        props.isCurrentMonth ? '#e0e0e0' : '#666'};
  cursor: pointer;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.isSelected ? '#4a4a8c' : '#3a3a50'};
  }
`;

const ButtonClear = styled.div`    
    display: inline-block;
    margin-top: 10px;
    padding: 7px;
    border-radius: 4px;
        
    &:hover {
        cursor: pointer;
        background-color: #3a3a50;
    }
`


export const DatePickerCell = memo(({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const containerRef = useRef(null);

    const selectedDate = value ? new Date(value) : null;

    // Format date as dd.mm.yyyy or return placeholder
    const formatDateDisplay = (date) => {
        if (!date) return "дд.мм.гггг";

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    };

    // Handle click outside to close picker
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Get days for the current month view
    const getDaysInMonth = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const days = [];

        // Adjust for Sunday as first day (0)
        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startDay; i > 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthDays - i + 1),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next month days
        const remainingCells = 42 - days.length; // 6 rows of 7 days
        for (let i = 1; i <= remainingCells; i++) {
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return days;
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date) => {
        if (!selectedDate) return false;

        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const handlePrevMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    const handleSelectDate = (date) => {
        onChange(date);
        setIsOpen(false);
    };

    const days = getDaysInMonth(
        currentDate.getFullYear(),
        currentDate.getMonth()
    );

    const monthNames = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    return (
        <DateCellContainer ref={containerRef}>
            <DateText hasDate={!!selectedDate}>
                {formatDateDisplay(selectedDate)}
            </DateText>

            <IconButton onClick={() => setIsOpen(!isOpen)}>
                <Calendar size={16} />
            </IconButton>

            <DatePickerContainer isOpen={isOpen}>
                <DatePickerHeader>
                    <MonthNavButton onClick={handlePrevMonth}>&#9664;</MonthNavButton>
                    <MonthYearDisplay>
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </MonthYearDisplay>
                    <MonthNavButton onClick={handleNextMonth}>&#9654;</MonthNavButton>
                </DatePickerHeader>

                <DaysGrid>
                    {dayNames.map(day => (
                        <DayHeader key={day}>{day}</DayHeader>
                    ))}

                    {days.map((day, index) => (
                        <DayCell
                            key={index}
                            isCurrentMonth={day.isCurrentMonth}
                            isToday={isToday(day.date)}
                            isSelected={isSelected(day.date)}
                            onClick={() => handleSelectDate(day.date)}
                        >
                            {day.date.getDate()}
                        </DayCell>
                    ))}
                </DaysGrid>
                <ButtonClear
                    onClick={() => handleSelectDate(null)}>
                    Очистить
                </ButtonClear>
            </DatePickerContainer>
        </DateCellContainer>
    );
});

DatePickerCell.displayName = 'DatePickerCell';