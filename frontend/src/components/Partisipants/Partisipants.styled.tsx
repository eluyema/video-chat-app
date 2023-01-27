import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import { styled } from '@mui/system';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const calculateGridTemplateColumn = (count: number) => {
    switch (count){
        case 1:
            return '1fr';
        case 2:
            return '1fr 1fr';
        case 3:
            return '1fr 1fr 1fr';
        case 4:
            return '1fr 1fr 1fr';
        case 5:
            return '1fr 1fr 1fr';
        case 6:
            return '1fr 1fr 1fr';
        default:
            return '1fr 1fr 1fr 1fr';
    }
}

const ParticipantsContainer = styled('div')<{count: number}>`
    display: grid;
    grid-template-columns: ${({count})=>calculateGridTemplateColumn(count)};
    justify-content: center;
    gap: 15px;
    width: 80%;
`

const PartisipantsSection = styled('div')({
    gridArea: 'partisipants',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap:"10px"
});

const PageNavigator = styled(ArrowForwardIosIcon)<{isLeft?: boolean}>`
    position: absolute;
    ${({isLeft}) => isLeft? 'left: 25px;': 'right: 25px;'}
    top: 50%;
    transform: ${({isLeft}) => isLeft? 'rotate(180deg) translateY(50%);': 'translateY(-50%);'}
    cursor: pointer;
    &:hover {
        fill: #42a5f5;
        transition: 0.3s ease-out;
    }
`;

export { ParticipantsContainer, PartisipantsSection, PageNavigator }