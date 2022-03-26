import { Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { confirmEvent } from '../../services/EventAPI';

const EventConfirmation = () => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const id = searchParams.get('id');
  const accepted = searchParams.get('accepted');
  const email = searchParams.get('email');
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    if (!id || !accepted || !email) {
      setStatusMessage("Missing parameter in link, can't confirm status");
    } else {
      if (!isNaN(Number(id))) {
        const confirm = async () => {
          try {
            await confirmEvent(Number(id), accepted, email);
            setStatusMessage('Status confirmed! You can safely close this windows');
          } catch (error) {
            setStatusMessage('Unexpected server error, your status has not been confirm');
          }
        };

        confirm();
      }
    }
  }, [accepted, email, id]);

  return (
    <div>
      <Typography variant="h4">{statusMessage}</Typography>
    </div>
  );
};

export default EventConfirmation;
