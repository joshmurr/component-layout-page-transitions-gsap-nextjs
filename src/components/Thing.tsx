import styled from "styled-components";

export const Thing = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 500px;
  height: 300px;
`;
