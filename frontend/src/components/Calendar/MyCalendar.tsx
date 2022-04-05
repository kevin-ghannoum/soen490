import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, SlotInfo, View } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../../services/EventAPI';
import EventCreationForm from './EventCreationForm';
import { makeStyles } from '@material-ui/core';
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

const calendarStyle = makeStyles({
  calendar: {
    height: '100vh',
  },
});

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<Array<Event>>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<any>();
  const [update, setUpdate] = useState<boolean>(false);
  useEffect(() => {
    getEventsData();
  }, []);
  const getEventsData = async () => {
    try {
      const data = (await (await getEvents()).data) as unknown as Array<any>;
      const temp: Array<Event> = [];
      data.forEach((event: EventDTO) => {
        event.start = event.start.slice(0, -1);
        event.end = event.end.slice(0, -1);
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
    setUpdate(true);
    setOpen(true);
    setSelectedValue(event);
  };

  const handleClose = () => {
    setOpen(false);
    getEventsData();
  };

  const handleSelectSlot = (event: SlotInfo) => {
    setUpdate(false);
    setOpen(true);
    setSelectedValue({ start: event.start, end: event.end });
  };

  const eventStyleGetter = () => {
    const style = {
      backgroundColor: '#2BB1E4',
      border: '1px solid #037CAA',
    };
    return {
      style: style,
    };
  };

  const classes = calendarStyle();

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
        className={classes.calendar}
        onSelectEvent={(event) => handleSelectEvent(event)}
        onSelectSlot={(event) => handleSelectSlot(event)}
        eventPropGetter={eventStyleGetter}
      />
      <EventCreationForm open={open} onClose={handleClose} selectedValue={selectedValue} update={update} />
    </div>
  );
};

export default MyCalendar;
