import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Chip, Collapse, Container, ListItemButton, MenuItem, MenuList } from '@mui/material';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

const drawerWidth = 240;

export default function ClippedDrawer() {
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            MAINSHOPPING
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {/* <MenuList>
            <ListItemButton onClick={handleClick}>
              <ListItemText primary="Product" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
              <MenuItem>
                <Box sx={{ pl: 4 }}>
                  <ListItemText primary="get" />
                </Box>
              </MenuItem>
              <MenuItem>
                <Box sx={{ pl: 4 }}>
                  <ListItemText primary="post" />
                </Box>
              </MenuItem>
              <MenuItem>
                <Box sx={{ pl: 4 }}>
                  <ListItemText primary="patch" />
                </Box>
              </MenuItem>
            </Collapse>
          </MenuList> */}

        </Box>
      </Drawer>
      <Container fixed>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />

          <h2>API</h2>
          <h3>Authentication</h3>

          <Box component="div" sx={{ pl: 4 }}>
            <Box>
              <h4>Get User</h4>
              <Chip label="Get" color="primary" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/user`}
            </Box>
            <Box>
              <h4>Login</h4>
              <Chip label="POST" color="error" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/login`}
            </Box>
            <Box>
              <h4>Register</h4>
              <Chip label="POST" color="error" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/register`}
            </Box>
          </Box>

          <h3>Products</h3>
          <Box component="div" sx={{ pl: 4 }}>
            <Box>
              <h4>Product all</h4>
              <Chip label="GET" color="primary" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/all`}
            </Box>

            <Box>
              <h4>Product create</h4>
              <Chip label="POST" color="error" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/create`}
            </Box>
            <Box>
              <h4>Product by id</h4>
              <Chip label="GET" color="primary" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/{id}`}
            </Box>
            <Box>
              <h4>Delete product</h4>
              <Chip label="DELETE" color="error" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/{id}`}
            </Box>
            <Box>
              <h4>Product update</h4>
              <Chip label="PATCH" color="warning" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/{id}`}
            </Box>
          </Box>

          <h3>Cart</h3>
          <Box component="div" sx={{ pl: 4 }}>
            <Box>
              <h4>Cart item all of user</h4>
              <Chip label="GET" color="primary" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/cart/all`}
            </Box>
            <Box>
              <h4>Add and Update item to cart</h4>
              <Chip label="POST" color="error" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/cart/create_update`}
            </Box>
            <Box>
              <h4>Delete item form cart</h4>
              <Chip label="DELETE" color="error" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/cart/{id}`}
            </Box>
          </Box>

          <h3>Payment</h3>
          <Box component="div" sx={{ pl: 4 }}>
             <Box>
              <h4>Payment product</h4>
              <Chip label="GET" color="primary" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/payment`}
            </Box>
          {/*  <Box>
              <h4>Product by id</h4>
              <Chip label="GET" color="primary" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/{id}`}
            </Box>
            <Box>
              <h4>Product create</h4>
              <Chip label="POST" color="error" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/create`}
            </Box>
            <Box>
              <h4>Product update</h4>
              <Chip label="PATCH" color="warning" /> {`${process.env.NEXT_PUBLIC_APP_URL}/api/product/update/{id}`}
            </Box> */}
          </Box>


        </Box>
      </Container>
    </Box >
  );
}