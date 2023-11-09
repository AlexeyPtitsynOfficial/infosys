import { ChangeEvent, useDebugValue, useState } from "react";
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../hooks"
import { useAddUserMutation, useUpdateUserMutation, selectUserById, useDeleteUserMutation, User } from "./usersApiSlice";
import Grid from "@mui/material/Grid";
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { GridRenderEditCellParams, GridRowModesModel } from "@mui/x-data-grid";


const EditUserForm = (props: {id: Number, onClose: (value?: string) => void}) => {

    const open = useState(true)
    //const id = useParams()
    const [addUser, { isSuccess :addSuccess }] = useAddUserMutation()
    const [updateUser, { isSuccess:updateSuccess }] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    const origin = useAppSelector((state) => selectUserById(state, Number(props.id)));
    
    const [data, setData] = useState<User>(origin || {
        id: 0,
        name: '',
        email: '',
        gender: 'male',
        hashed_password: '',
        status: 'inactive',
        is_active: true,
        phone: '',
        role_id: 0
    });

    const [ checked, setChecked ] = useState(false)
    
    const handleClose = () => {
        props.onClose()
    };

    const onDataChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        
        setData({...data, [e.target.name]: e.target.value})
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        setData({...data, [e.target.name]: e.target.value})
    };

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {

        setData({...data, status: event.target.checked ? 'active' : 'inactive'})
        setChecked(event.target.checked);
    };

    const onSave = async () => {
        if(data) {

            try {
                if(data.id == 0) {
                    await addUser(data).unwrap()
                }
                else {
                    await updateUser(data).unwrap()
                }
            }
            catch (error) {
                console.error('Failed to save', error)
            }
        }
    }

    const onDelete = async() => {
        try {
            await deleteUser(data).unwrap()
        } catch (error) {
            console.error('Failed to delete', error)
        }
    }

    if(addSuccess || updateSuccess) {
        props.onClose()
    }

    return (
        <Dialog fullWidth open={true}  onClose={handleClose} maxWidth="sm">
            <DialogTitle>Редактирование пользователя</DialogTitle>
            <DialogContent>
                <form onSubmit={onSave}>
                    <Grid container direction="column" spacing={1} justifyContent="center">
                        <Grid item><TextField fullWidth size='small' label='Имя' name="name" value={data.name} onChange={onDataChanged}/></Grid>
                        <Grid item><TextField fullWidth size='small' label='Почта' name="email" value={data.email} onChange={onDataChanged}/></Grid>
                        <Grid item>
                            <FormControl fullWidth>
                                <InputLabel id="postUsersLabel">Пол</InputLabel>
                                <Select
                                    labelId="postUsersLabel"
                                    id="gender"
                                    value={data.gender}
                                    label="Age"
                                    name="gender"
                                    onChange={handleSelectChange}
                                    >
                                    <MenuItem id="male" key="male" value="male">Мужской</MenuItem>
                                    <MenuItem id="female" key="female" value="female">Женский</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormGroup>
                                <FormControlLabel required control={<Checkbox checked={checked} onChange={handleCheckBoxChange}/>} label="Статус" />
                            </FormGroup>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>Отмена</Button>
                <Button type="submit" onClick={onSave}>Сохранить</Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditUserForm