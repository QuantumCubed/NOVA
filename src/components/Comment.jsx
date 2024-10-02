import React from "react";
import styled from "styled-components";
import pfp_default from "../img/pfp_default.jpg";

const Container = styled.div`
  display: flex;
  gap: 10px;
  margin: 30px 0px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: ${({ theme }) => theme.text};
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.textSoft};
  margin-left: 5px;
`;

const Text = styled.span`
  font-size: 14px;
`;

function Comment() {
  return (
    <Container>
      <Avatar src={pfp_default} />
      <Details>
        <Name>
          Batman<Date>2 Hours Ago</Date>{" "}
        </Name>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
          beatae expedita amet veniam eos. Vel incidunt explicabo qui? Magni
          natus aperiam molestiae. Voluptatem non hic quae repudiandae tenetur
          quasi quo.
        </Text>
      </Details>
    </Container>
  );
}

export default Comment;
