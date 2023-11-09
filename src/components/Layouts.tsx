import { Outlet} from 'react-router-dom';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Drawer from './Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

const Layout = () => {

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer/>
            <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <DrawerHeader/>
                <Outlet/>
            </Box>
        </Box>
    )
}

export default Layout