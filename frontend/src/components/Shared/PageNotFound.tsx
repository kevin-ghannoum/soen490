import { Button, Typography } from '@material-ui/core';

const PageNotFound: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#7ED0F0',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>
        <img
          src="https://cdn.discordapp.com/attachments/885685523954401340/931384157764984842/404_Pin.png"
          width="50%"
          alt="404 error"
        ></img>
        <Typography variant="h3" style={{ color: 'white', margin: '30px' }}>
          We couldn't spark your page!
        </Typography>
        <a href="/" style={{ textDecoration: 'None' }}>
          <Button
            variant="contained"
            style={{ padding: '10px', paddingLeft: '15px', paddingRight: '15px', background: 'white', margin: '20px' }}
          >
            <Typography style={{ color: '#2BB1E4', fontWeight: 'bold' }}>GO TO HOMEPAGE</Typography>
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
