import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";

const StyledApp = styled.div`
  background-color: var(--color-grey-200);
  padding: 2rem 4rem;
`;

const H1 = styled.h1`
  font-weight: 600;
  color: var(--color-yellow-700);
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <H1>The Wild Oasis</H1>
        <Button>Check in</Button>
      </StyledApp>
    </>
  );
}

export default App;
