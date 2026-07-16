import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";
import type { UdateCabinType, CabinType } from "../../types/CabinType";

import FileInput from "../../ui/FileInput";
import Input from "../../ui/Input";
import Textarea from "../../ui/Textarea";
import Button from "../../ui/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const StyledUpdateCabinForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
`;

const H3 = styled.h3`
  padding-left: 3rem;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: lighter;
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 3rem 1rem 3rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  justify-self: stretch;
  padding-top: 3rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

interface UpdateCabinFormProps {
  cabinToEdit: CabinType;
}

function UpdateCabinForm({ cabinToEdit }: UpdateCabinFormProps) {
  const { id: editId, ...editValues } = cabinToEdit;

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<UdateCabinType>({
    defaultValues: {
      name: editValues.name,
      maxCapacity: editValues.maxCapacity,
      regularPrice: editValues.regularPrice,
      discount: editValues.discount,
      description: editValues.description,
      image: editValues.image,
    },
  });

  return (
    <Container>
      <H3>Edit cabin {editValues.name}</H3>
      <StyledUpdateCabinForm>
        <FormRow>
          <Label htmlFor="name">Cabin name</Label>
          <Input
            type="text"
            id="name"
            {...register("name", { required: "This field is required" })}
          />
          {errors?.name?.message && <Error>{errors?.name?.message}</Error>}
        </FormRow>

        <FormRow>
          <Label htmlFor="maxCapacity">Max capacity</Label>
          <Input
            type="number"
            id="maxCapacity"
            {...register("maxCapacity", {
              required: "This field is required",
              min: { value: 1, message: "Capacity should be at least 1" },
            })}
          />
          {errors?.maxCapacity?.message && (
            <Error>{errors?.maxCapacity?.message}</Error>
          )}
        </FormRow>

        <FormRow>
          <Label htmlFor="regularPrice">Regular Price</Label>
          <Input
            type="number"
            id="regularPrice"
            {...register("regularPrice", {
              required: "This field is required",
              min: { value: 1, message: "Price should be at least 1" },
            })}
          />
          {errors?.regularPrice?.message && (
            <Error>{errors?.regularPrice?.message}</Error>
          )}
        </FormRow>

        <FormRow>
          <Label htmlFor="discount">Discount</Label>
          <Input
            type="number"
            id="discount"
            {...register("discount", {
              required: "This field is required",
              validate: (velues) =>
                Number(velues) <= Number(getValues().regularPrice) ||
                "Discount should be less than regular price",
            })}
          />
          {errors?.discount?.message && (
            <Error>{errors?.discount?.message}</Error>
          )}
        </FormRow>

        <FormRow>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register("description", { required: "This field is required" })}
          />
          {errors?.description?.message && (
            <Error>{errors?.description?.message}</Error>
          )}
        </FormRow>

        <FormRow>
          <Label htmlFor="image">Description</Label>
          <FileInput
            id="image"
            accept="image/*"
            {...register("image", { required: "This field is required" })}
          />
          {errors?.image?.message && <Error>{errors?.image?.message}</Error>}
        </FormRow>

        <ButtonRow>
          <Button $variation="secondary" $size="medium" type="reset">
            Cancel
          </Button>
          <Button $variation="primary" $size="medium">
            Save changes
          </Button>
        </ButtonRow>
      </StyledUpdateCabinForm>
    </Container>
  );
}

export default UpdateCabinForm;
