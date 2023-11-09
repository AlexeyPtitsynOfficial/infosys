import { selectAllUsers, selectUserIds, useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "./usersApiSlice";
import { Link } from "react-router-dom";
import { User } from "./usersApiSlice";
import Stack from "@mui/material/Stack";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

import {
    GridRowsProp,
    GridRowModesModel,
    GridRowModes,
    GridColDef,
    GridRowParams,
    MuiEvent,
    GridToolbarContainer,
    GridActionsCellItem,
    GridEventListener,
    GridRowId,
    GridRowModel,
    GridRowProps,
    GridRenderEditCellParams,
} from '@mui/x-data-grid';
import React, { useState } from "react";
import EditUserForm from "./EditUserForm";
import { useAppSelector } from "../../hooks";


function EditToolbar(props: any) {
    const { setRowModesModel } = props;
    
  
    const handleClick = () => {
      //const id = 0;//randomId();
      //setRows((oldRows : any) => [...oldRows, { id, name: '', age: '', isNew: true }]);
      /*setRowModesModel((oldModel: any) => ({
        ...oldModel,
        [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));*/
      props.setSelectedRowId(-1)
      props.setOpen(true)
    };
  
    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Добавить
        </Button>
        
      </GridToolbarContainer>
    );
  }

const UsersList = () => {

    const [open, setOpen] = useState(false)
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [selectedRowId, setSelectedRowId] = useState(-1);

    const columns: GridColDef[] =[
        { field: 'id', headerName: 'id', width: 10, hideable: true},
        { field: 'name', headerName: 'Имя', width: 200 },
        { field: 'email', headerName: 'Эл. почта', width: 250 },
        { field: 'status', headerName: 'Статус', width: 150 },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: ( { id } ) => {
              const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
      
              if (isInEditMode) {
                return [
                  <GridActionsCellItem
                    icon={<SaveIcon />}
                    label="Save"
                    onClick={handleSaveClick(id)}
                  />,
                  <GridActionsCellItem
                    icon={<CancelIcon />}
                    label="Cancel"
                    className="textPrimary"
                    onClick={handleCancelClick(id)}
                    color="inherit"
                  />,
                ];
              }
      
              return [
                <GridActionsCellItem
                  icon={<EditIcon />}
                  label="Edit"
                  className="textPrimary"
                  onClick={handleEditClick(id)}
                  color="inherit"
                />,
                <GridActionsCellItem
                  icon={<DeleteIcon />}
                  label="Delete"
                  onClick={handleDeleteClick(id)}
                  color="inherit"
                />,
              ];
            },
          },
    ];

    const { refetch,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery()

    const users = useAppSelector(selectAllUsers);
    const [deleteUser, {isSuccess: deleteSuccess}] = useDeleteUserMutation();

    const handleEditClick = (id: GridRowId) => () => {
        //setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
        //setOpen(true)
        setSelectedRowId(Number(id));
        setOpen(true)
    };
    
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    
    const handleDeleteClick = (id: GridRowId) => async () => {
        try {
          await deleteUser(Number(id)).unwrap()
        }
        catch(error){

        }
    };

    if(deleteSuccess)
      refetch()
    
    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
          ...rowModesModel,
          [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });
    
        const editedRow = users.find((user:any) => user.id === id);
        //if (editedRow!.isNew) {
          //setRows(users.filter((user:any) => user.id !== id));
        //}
    };
    
    const handleDialogClose =() => {
      setOpen(false)
      refetch()
    }

    let content  = <p>Загрузка...</p>;
    if(isLoading) {
        content = <p>Загрузка...</p>
    } else if (isSuccess) {
        content = (
            <Stack sx={{width: '100%'}}>
                <Typography variant="h6">Список пользователей</Typography>
                { open ? <EditUserForm id={selectedRowId} onClose={handleDialogClose}/>: ''}
                <div style={{ height: 450, width: '100%' }}>
                    <DataGrid density="compact" 
                        rowModesModel={rowModesModel} 
                        columns={columns} rows={users}
                        slots={{
                            toolbar: EditToolbar,
                          }}
                          slotProps={{
                            toolbar: { setOpen, setRowModesModel, setSelectedRowId },
                          }}
                        />
                </div>
            </Stack>
        )
    } else if (isError) {
        content = <p>{JSON.stringify(error)}</p>
    }

    return content
}

export default UsersList