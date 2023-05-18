import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { Card } from "@mui/material";



export default function PastNestedList() {

      
      const [open, setOpen] = React.useState(false);
      const [open2, setOpen2] = React.useState(false);
      const [open3, setOpen3] = React.useState(false);
      
      const handleClick = () => {
        setOpen(!open);
      };
      
      
      const handleClick2 = () => {
        setOpen2(!open2);
      };
      
      const handleClick3 = () => {
        setOpen3(!open3);
      };
    return(
<Card sx={{ minWidth: 275 }}>
<List
sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
component="nav"
aria-labelledby="nested-list-subheader"
subheader={
<ListSubheader component="div" id="nested-list-subheader">
Third Semester
</ListSubheader>
}
>


<ListItemButton onClick={handleClick}>
<ListItemIcon>
<InboxIcon />
</ListItemIcon>

<ListItemText primary="Past Questions" />
{open ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={open} timeout="auto" unmountOnExit>
<List component="div" disablePadding>
<ListItemButton sx={{ pl: 4 }}>
<ListItemIcon>
<StarBorder />
</ListItemIcon>
<ListItemText primary="Starred" />
</ListItemButton>

<ListItemButton sx={{ pl: 4 }}>
<ListItemIcon>
<StarBorder />
</ListItemIcon>
<ListItemText primary="Starred" />
</ListItemButton>

</List>
</Collapse>

<ListItemButton onClick={handleClick2}>
<ListItemIcon>
<InboxIcon />
</ListItemIcon>

<ListItemText primary="Past Questions Solutions" />
{open2 ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={open2} timeout="auto" unmountOnExit>
<List component="div" disablePadding>
<ListItemButton sx={{ pl: 4 }}>
<ListItemIcon>
<StarBorder />
</ListItemIcon>
<ListItemText primary="Starred" />
</ListItemButton>

<ListItemButton sx={{ pl: 4 }}>
<ListItemIcon>
<StarBorder />
</ListItemIcon>
<ListItemText primary="Starred" />
</ListItemButton>

</List>
</Collapse>

<ListItemButton onClick={handleClick3}>
<ListItemIcon>
<InboxIcon />
</ListItemIcon>

<ListItemText primary="Past Questions Topics" />
{open3 ? <ExpandLess /> : <ExpandMore />}
</ListItemButton>
<Collapse in={open3} timeout="auto" unmountOnExit>
<List component="div" disablePadding>
<ListItemButton sx={{ pl: 4 }}>
<ListItemIcon>
<StarBorder />
</ListItemIcon>
<ListItemText primary="Starred" />
</ListItemButton>

<ListItemButton sx={{ pl: 4 }}>
<ListItemIcon>
<StarBorder />
</ListItemIcon>
<ListItemText primary="Starred" />
</ListItemButton>

</List>
</Collapse>
</List>

</Card>

    )
}

