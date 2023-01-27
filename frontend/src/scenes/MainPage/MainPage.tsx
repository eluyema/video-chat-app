import React from "react";
import ListOfWaiters from "../../components/ListOfWaiters/ListOfWaiters";
import JoinToCall from "./components/JoinToCall/JoinToCall";
import SessionBlock from "./components/SessionBlock/SessionBlock";
import { MainPageWrapper } from "./MainPage.styled";

const MainPage = () => {
    return <MainPageWrapper>
        <JoinToCall />
        <SessionBlock />
    </MainPageWrapper>
}

export default MainPage