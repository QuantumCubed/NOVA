import ReportIcon from "@mui/icons-material/BugReportOutlined";
import HelpIcon from "@mui/icons-material/ContactSupportOutlined";
import ExploreIcon from "@mui/icons-material/GpsFixed";
import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/HourglassBottom";
import LibraryIcon from "@mui/icons-material/LibraryBooksOutlined";
import ThemeIcon from "@mui/icons-material/LightMode";
import LoginIcon from "@mui/icons-material/LoginOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import SubscriptionIcon from "@mui/icons-material/Star";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LogoImage from "../img/logo.png";

const Container = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.bgLighter};
  height: 100vh;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  position: sticky;
  top: 0;
`;

const Wrapper = styled.div`
  padding: 18px 26px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 7.5px;
  font-weight: bold;
  margin-bottom: 25px;
`;

const Img = styled.img`
  height: 25px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  padding: 7.5px 0px;
`;

const Hr = styled.hr`
  margin: 5px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Login = styled.div`
  text-align: center;
  width: 100%;
`;

const Button = styled.button`
  padding: 3px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 5px;
  font-weight: bold;
  margin: 15px;
  margin-top: 7px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 5px;
  padding-right: 12px;
`;

const Menu = ({ darkMode, setDarkMode }) => {
  return (
    <Container>
      <Wrapper>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Logo>
            <Img src={LogoImage} alt="Logo" />
            NOVA
          </Logo>
          <Item>
            <HomeIcon />
            Home
          </Item>
          <Item>
            <ExploreIcon />
            Explore
          </Item>
          <Item>
            <SubscriptionIcon />
            Subscriptions
          </Item>
          <Hr />
          <Login>
            Sign in to like, comment, and subscribe.
            <Button>
              <LoginIcon></LoginIcon>SIGN IN
            </Button>
          </Login>
          <Hr />
          <Item>
            <LibraryIcon />
            Library
          </Item>
          <Item>
            <HistoryIcon />
            History
          </Item>
          <Item>
            <SettingsIcon />
            Settings
          </Item>
          <Hr />
          <Item>
            <ReportIcon />
            Report
          </Item>
          <Item>
            <HelpIcon />
            Help
          </Item>
        </Link>
        <Item onClick={() => setDarkMode(!darkMode)}>
          <ThemeIcon />
          {darkMode ? "Light" : "Dark"} Mode
        </Item>
        <Item></Item>
      </Wrapper>
    </Container>
  );
};

export default Menu;
