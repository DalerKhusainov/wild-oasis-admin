import Heading from "../ui/Heading";
import Row from "../ui/Row";
import { useCabins } from "../features/cabins/useCabins";

function Cabins() {
  const { cabins, isLoading, error } = useCabins();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(cabins);

  return (
    <Row $type="horizontal">
      <Heading as="h1">All cabins</Heading>
      <p>TEST</p>
    </Row>
  );
}

export default Cabins;
