import LoginIcon from "@mui/icons-material/LoginOutlined";
import SearchIcon from "@mui/icons-material/SearchOutlined";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.bg};
  height: 56px;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  padding: 0px 20px;
  position: relative;
`;

const Search = styled.div`
  width: 40%;
  position: absolute;
  left: 0px;
  right: 0px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  font-weight: 500;
`;

const Button = styled.button`
  padding: 3px 15px;
  background-color: transparent;
  border: 1px solid #3ea6ff;
  color: #3ea6ff;
  border-radius: 5px;
  font-weight: bold;
  margin: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  padding-left: 5px;
  padding-right: 12px;
`;

const Navbar = () => {
  return (
    <Container>
      <Wrapper>
        <Search>
          <Input placeholder="Search" />
          <SearchIcon />
        </Search>
        <Button>
          <LoginIcon></LoginIcon>SIGN IN
        </Button>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
