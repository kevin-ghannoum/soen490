import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, SlotInfo, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../../services/CalendarAPI';
import EventCreationForm from './EventCreationForm';
export interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  createdBy: string;
  accounts: Array<{ firstName: string; lastName: string; Invited: { email: string; status: string; id: number } }>;
}

interface EventDTO {
  id: number;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  createdBy: string;
  accounts: Array<{ firstName: string; lastName: string; Invited: { email: string; status: string; id: number } }>;
}
const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Array<Event>>([]);
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<any>();
  useEffect(() => {
    getEventsData();
  }, []);
  const getEventsData = async () => {
    try {
      const data = (await (await getEvents()).data) as unknown as Array<any>;
      console.log(data);
      const temp: Array<Event> = [];
      data.forEach((event: EventDTO) => {
        temp.push({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          location: event.location,
          description: event.description,
          createdBy: event.createdBy,
          accounts: event.accounts,
        });
      });
      setEvents(temp);
    } catch (err) {}
  };
  const localizer = momentLocalizer(moment);
  const allViews: View[] = ['agenda', 'day', 'week', 'month'];

  const handleSelectEvent = (event: Event) => {
    setOpen(true);
    setSelectedValue(event);
  };

  const handleClose = () => {
    setOpen(false);
    getEventsData();
  };

  const handleSelectSlot = (event: SlotInfo) => {
    setOpen(true);
    setSelectedValue({ start: event.start, end: event.end });
  };

  return (
    <div>
      {events.length !== 0 ? (
        <>
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
            onSelectSlot={(event) => handleSelectSlot(event)}
          />
          <EventCreationForm open={open} onClose={handleClose} selectedValue={selectedValue} />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MyCalendar;
