import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import pfp_default from "../img/pfp_default.jpg";
import thumbnail_default from "../img/thumbnail_default.jpg";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "360px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  max-width: 284px;
  padding-left: 0px;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: ${(props) => props.type === "sm" && "none"};
`;

const Image = styled.img`
  height: ${(props) => (props.type === "sm" ? "110px" : "160px")};
  flex: 1;
`;

const Texts = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: ${(props) => (props.type === "sm" ? "14px" : "13px")};
  color: ${({ theme }) => theme.textSoft};
  margin: 5px 0px;
`;

const Info = styled.div`
  font-size: ${(props) => (props.type === "sm" ? "14px" : "13px")};
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type }) => {
  return (
    <Link to="/video/test" style={{ textDecoration: "none" }}>
      <Container type={type}>
        <Image type={type} src={thumbnail_default} />
        <Details type={type}>
          <ChannelImage type={type} src={pfp_default} />
          <Texts>
            <Title>Mystery Video</Title>
            <ChannelName>Steiner</ChannelName>
            <Info> 444,888 views • 1 day ago</Info>
          </Texts>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
