import { styled } from "@mui/system";

const SessionNameBlock = styled('div')({
    paddingTop: '12vh',
    display: 'flex',
    justifyContent: 'center'
})

const SessionDescriptionBlock = styled('div')({
    minHeight: '6vh',
    paddingBottom: '2vh',
    color: '#4e4e4e',
    width: '60vw',
    display: 'flex',
    justifyContent: 'center',
})

const SessionDateBlock = styled('div')({
    height: '6vh',
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '4vh',
})

export { SessionNameBlock, SessionDescriptionBlock, SessionDateBlock }
