import React, { useState, useEffect } from 'react';
import '../styles/widgets.css';

const AnalogClock = () => {
  useEffect(() => {
    // Load the Logwork clock script
    const script = document.createElement('script');
    script.src = 'https://cdn.logwork.com/widget/clock.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="widget clock-widget">
      <div className="logwork-clock-container">
        <a
          href="https://logwork.com/current-time-in-delhi-india-madhya-pradesh"
          className="clock-time"
          data-style="default-numeral"
          data-size="100"
          data-timezone="Asia/Kolkata"
        >
          Current time in Delhi, India
        </a>
      </div>
    </div>
  );
};

const CalendarWidget = () => {
  const [date] = useState(new Date());
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const today = new Date();

    const blanks = [];
    for (let i = 0; i < firstDay; i++) {
      blanks.push(<div key={`blank-${i}`} className="day empty"></div>);
    }

    const daysInMonthArray = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today.getDate() &&
                     month === today.getMonth() &&
                     year === today.getFullYear();
      daysInMonthArray.push(
        <div
          key={`day-${d}`}
          className={`day ${isToday ? 'today' : ''}`}
        >
          {d}
        </div>
      );
    }

    return [...blanks, ...daysInMonthArray];
  };

  return (
    <div className="widget calendar-widget">
      <div className="calendar-header">
        <h3>{months[date.getMonth()]} {date.getFullYear()}</h3>
      </div>
      <div className="calendar-grid">
        {days.map(day => (
          <div key={day} className="day-header">{day}</div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
};

const YouTubeLive = () => {
  return (
    <div className="widget youtube-widget">
      <div className="youtube-container">
        <iframe
          src="https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=0&mute=0&controls=1"
          title="YouTube Live Stream"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};

const Widgets = () => {
  return (
    <div className="widgets-container">
      <YouTubeLive />
      <div className="widget">
        <div className="clock-calendar-container">
          <AnalogClock />
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
};

export default Widgets;
