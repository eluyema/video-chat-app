import { styled } from '@mui/system';

const SessionContainer = styled('div')({
    height: '100%',
    display: 'grid',
    gridTemplateAreas:
    `
        "partisipants partisipants sidesection"\n
        "controller controller sidesection"
    `,
    gridTemplateColumns: "3fr 3fr 2fr",
    gridTemplateRows: "5fr 1fr",
    backgroundColor: '#2e2e2e',
    padding: "15px",
})

const SessionSideSection = styled('div')({
    gridArea: 'sidesection',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    gap: '15px'
});

const ControllerSection = styled('div')({
    gridArea: 'controller',
});

export { SessionContainer, SessionSideSection, ControllerSection }
