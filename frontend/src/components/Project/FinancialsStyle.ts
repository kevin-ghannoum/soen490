import { makeStyles } from '@material-ui/core';

const financialsStyle = makeStyles((theme) => ({
    SingleProjectFormWrapper: {
        [theme.breakpoints.down('lg')]: {
            width: '60%',
        },
        [theme.breakpoints.down('sm')]: {
            width: '70%',
        },
        width: '70%',
        margin: 'auto',
    },
    infoTag: {
        fontWeight: 'bold',
    },
    profitDisplay: {
        display: 'flex',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dialogContentMenus: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignContent: 'center',
        margin: 10,
    },
}));

export default financialsStyle;
