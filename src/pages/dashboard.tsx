import { Route, Routes, useNavigate } from "react-router-dom";
import Protected from '../pages/nestedPages/protected.tsx'
import StudentAddEdit from "./nestedPages/StudentAddEdit.tsx";
import Studentlist from "./nestedPages/Studentlist.tsx";
import Transferstudent from "./nestedPages/Transferstudent.tsx";
import TeacherAddEdit from "./nestedPages/TeacherAddEdit.tsx";
import Teacherlist from "./nestedPages/Teacherlist.tsx";
import Teacherallocation from "./nestedPages/Teacherallocation.tsx";
import SubjectAddEdit from "./nestedPages/SubjectAddEdit.tsx";
import Subjectlist from "./nestedPages/Subjectlist.tsx";
import Registration from "./nestedPages/Registration.tsx";
import Syllabusform from "./nestedPages/Syllabusform.tsx";
import Syllabuslist from "./nestedPages/Syllabuslist.tsx";
import Classform from "./nestedPages/Classform.tsx";
import Classlist from "./nestedPages/Classlist.tsx";
import Feestructure from "./nestedPages/Feestructure.tsx";
import Feesubmission from "./nestedPages/Feesubmission.tsx";
import Feevoucher from "./nestedPages/Feevoucher.tsx";
import Admission from "./nestedPages/Admission.tsx";
import Examshedule from "./nestedPages/Examshedule.tsx";
import Examresult from "./nestedPages/Examresult.tsx";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BATreeView from "../components/batreeview.tsx";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Dashboard() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const treeStructure =[
    {
      moduleName: "Student",
      child: [
        {
          name: "Student Add/Edit",
          route: "StudentAddEdit",
        },
        {
          name: "Student List",
          route: "Studentlist",
        },
        {
            name: "Transfer Student",
            route: "Transferstudent",
          },
      ],
    },
    {
      moduleName:"Teacher",
      child: [
        {
          name: "Teacher Add/Edit",
          route: "TeacherAddEdit",
        },
        {
          name: "Teacher List",
          route: "Teacherlist",
        },
        {
            name: "Teacher Allocation",
            route: "Teacherallocation",
          },
      ],
    },
    {
        moduleName: "Subjects",
        child: [
          {
            name: "Subject Add/Edit",
            route: "SubjectAddEdit",
          },
          {
            name: "Subject List",
            route: "Subjectlist",
          },
        ],
      },
      {
        moduleName: "School",
        child: [
          {
            name: "Registration",
            route: "Registration",
          }
        ],
      },
      {
        moduleName: "Syllabus",
        child: [
          {
            name: "Syllabus Form",
            route: "Syllabusform",
          },
          {
            name: "Syllabus List",
            route: "Syllabuslist",
          }
        ],
      },
      {
        moduleName: "Class",
        child: [
          {
            name: "Class Form",
            route: "Classform",
          },
          {
            name: "Class List",
            route: "Classlist",
          }
        ],
      },
      {
        moduleName: "Fees",
        child: [
          {
            name: "Fees Structure",
            route: "Feestructure",
          },
          {
            name: "Fee Submission",
            route: "Feesubmission",
          }
         ,
          {
            name: "Fee Voucher",
            route: "Feevoucher",
          }
        ],
      },
      {
        moduleName: "Admission",
        child: [
          {
            name: "Admission",
            route: "Admission",
          }
        ],
      },
      {
        moduleName: "Exams",
        child: [
          {
            name: "Exam Shedule",
            route: "Examshedule",
          },
          {
            name: "Exam Result",
            route: "Examresult",
          }
        ],
      },
  ];

  const navigate = useNavigate();

  const navigateScreem = (route: string) => {
    navigate(`/dashboard/${route}`);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={{ mr: 2,...(open && { display: "none" }) }}
            >
            <MenuIcon />
          </IconButton>
          <Typography   variant="h6" noWrap component="div">
              
               SCHOOL MANAGMENT SYSTEM
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "&.MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "ltr"? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <BATreeView treeStructure={treeStructure} navigateScreem={navigateScreem} />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
  <Route path="StudentAddEdit" element={<Protected component={StudentAddEdit} />} />
  <Route path="Studentlist" element={<Protected component={Studentlist} />} />
  <Route path="Transferstudent" element={<Protected component={Transferstudent} />} />
  <Route path="TeacherAddEdit" element={<Protected component={TeacherAddEdit} />} />
  <Route path="Teacherlist" element={<Protected component={Teacherlist} />} />
  <Route path="Teacherallocation" element={<Protected component={Teacherallocation} />} />
  <Route path="SubjectAddEdit" element={<Protected component={SubjectAddEdit} />} />
  <Route path="Subjectlist" element={<Protected component={Subjectlist} />} />
  <Route path="Registration" element={<Protected component={Registration} />} />
  <Route path="Syllabusform" element={<Protected component={Syllabusform} />} />
  <Route path="Syllabuslist" element={<Protected component={Syllabuslist} />} />
  <Route path="Classform" element={<Protected component={Classform} />} />
  <Route path="Classlist" element={<Protected component={Classlist} />} />
  <Route path="Feestructure" element={<Protected component={Feestructure} />} />
  <Route path="Feesubmission" element={<Protected component={Feesubmission} />} />
  <Route path="Feevoucher" element={<Protected component={Feevoucher} />} />
  <Route path="Admission" element={<Protected component={Admission} />} />
  <Route path="Examshedule" element={<Protected component={Examshedule} />} />
  <Route path="Examresult" element={<Protected component={Examresult} />} />
</Routes>
      </Main>
    </Box>
  );
}