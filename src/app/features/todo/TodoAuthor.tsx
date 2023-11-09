import { FunctionComponent } from "react";
import { useAppSelector } from "../../hooks";
import { selectAllUsers } from "../users/usersApiSlice";
import { Typography } from "@mui/material";

type AppProps = {
    user_id: number | undefined;
}

const TodoAuthor : FunctionComponent<AppProps> = (props: AppProps) => {

    const users = useAppSelector(selectAllUsers)
    const author = users.find(user => user.id === props.user_id);

    return (<Typography variant='body2'>Автор: {author ? author.name : 'Неизвестен'}</Typography>)
}

export default TodoAuthor