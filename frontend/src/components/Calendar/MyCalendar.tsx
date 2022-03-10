import React from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  createdBy: { name: string; email: string };
  invitee: Array<{ name: string; email: string }>;
}
const MyCalendar: React.FC = () => {
  const events: Array<Event> = [
    {
      id: 1,
      title: 'Event1',
      start: new Date('March 07 , 2022 03:24:00'),
      end: new Date('March 07 , 2022 04:24:00'),
      location: 'zoom',
      description: 'Test event 1',
      createdBy: { name: 'Simon', email: 'simon@test.com' },
      invitee: [
        { name: 'Bob1', email: 'bob1@test.com' },
        { name: 'bob2', email: 'bob2@test.com' },
      ],
    },
    {
      id: 2,
      title: 'Event2',
      start: new Date('March 07 , 2022 06:24:00'),
      end: new Date('March 07 , 2022 07:24:00'),
      location: 'zoom',
      description: 'Test event 2',
      createdBy: { name: 'Simon', email: 'simon@test.com' },
      invitee: [
        { name: 'Bob1', email: 'bob1@test.com' },
        { name: 'bob2', email: 'bob2@test.com' },
      ],
    },
    {
      id: 3,
      title: 'Event3',
      start: new Date('March 08 , 2022 03:24:00'),
      end: new Date('March 08 , 2022 04:24:00'),
      location: 'zoom',
      description: 'Test event 3',
      createdBy: { name: 'Simon', email: 'simon@test.com' },
      invitee: [
        { name: 'Bob1', email: 'bob1@test.com' },
        { name: 'bob2', email: 'bob2@test.com' },
      ],
    },
  ];
  const localizer = momentLocalizer(moment);
  const allViews: View[] = ['agenda', 'day', 'week', 'month'];

  const handleSelectEvent = (event: Event) => {
    console.log(event);
  };
  return (
    <div>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={allViews}
        defaultView="week"
        style={{ height: '100vh' }}
        onSelectEvent={(event) => handleSelectEvent(event)}
      />
    </div>
  );
};

export default MyCalendar;
