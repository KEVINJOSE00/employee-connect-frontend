/*!

=========================================================
* * NextJS Material Dashboard v1.0.0 based on Material Dashboard React v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-material-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/nextjs-material-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
import ChatIcon from '@material-ui/icons/Chat';
import DeleteIcon from '@material-ui/icons/Delete';
import LocationOn from "@material-ui/icons/LocationOn";
import Notifications from "@material-ui/icons/Notifications";
import Unarchive from "@material-ui/icons/Unarchive";
import Language from "@material-ui/icons/Language";

const dashboardRoutes = [
  {
    path: "/message/chat",
    name: "Chats",
    rtlName: "طباعة",
    icon: ChatIcon,

    layout: "/admin",
  },
  {
    path: "/employees",
    name: "Employee List",
    rtlName: "قائمة الجدول",
    icon: "content_paste",

    layout: "/admin",
  },
];

export default dashboardRoutes;
