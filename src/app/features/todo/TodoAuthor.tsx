import { FunctionComponent, memo } from "react";
import { useAppSelector } from "../../hooks";
import { selectAllUsers } from "../users/usersApiSlice";
import { Typography } from "@mui/material";
import { f } from "msw/lib/core/RequestHandler-bb5cbb8f";
import { retry } from "@reduxjs/toolkit/dist/query";

type AppProps = {
    user_id: string | undefined;
}

const TodoAuthor : FunctionComponent<AppProps> = (props: AppProps) => {

    const users = useAppSelector(selectAllUsers)
    const author = users.find(user => user.id === Number(props.user_id));

    return (<Typography variant='body2'>Автор: {author ? author.name : 'Неизвестен'}</Typography>)
}

export default memo(TodoAuthor,(prevProps: AppProps, nextProps: AppProps) => {
    if(prevProps.user_id == nextProps.user_id)
        return false
    else 
        return true;
})