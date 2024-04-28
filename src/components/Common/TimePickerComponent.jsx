import React, { useState } from 'react';
import TimePicker from 'react-time-picker';

const TimePickerComponent = () => {
  const [time, setTime] = useState('10:00');

  return (
    <div>
      <TimePicker
        onChange={setTime}
        value={time}
        clockIcon={null} // Removes the clock icon
        minTime="10:00"
        maxTime="22:00"
      />
    </div>
  );
};

export default TimePickerComponent;
