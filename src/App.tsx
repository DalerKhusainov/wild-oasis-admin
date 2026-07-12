import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles";
import Button from "./ui/Button";
import Heading from "./ui/Heading";

const StyledApp = styled.div`
  background-color: var(--color-grey-200);
  padding: 2rem 4rem;
`;

function App() {
  return (
    <>
      <GlobalStyles />
      <StyledApp>
        <Heading as="h1">The Wild Oasis</Heading>
        <Button>Check in</Button>
        <Heading as="h3">Heading 3</Heading>
        <Heading as="h2">Heading 2</Heading>
      </StyledApp>
    </>
  );
}

export default App;
