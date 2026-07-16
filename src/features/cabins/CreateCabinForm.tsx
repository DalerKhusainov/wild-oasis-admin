import styled from "styled-components";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import type { CreateCabinType } from "../../types/CabinType";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";

const ButtonRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function CreateCabinForm() {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<CreateCabinType>();
  const { mutate: createCabin, isPending: isCreatingCabin } = useCreateCabin();

  const onSubmit: SubmitHandler<CreateCabinType> = (formData) => {
    createCabin(
      { ...formData, image: formData.image[0] },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  // const onError = (error) => console.log(error);

  return (
    // <Form onSubmit={handleSubmit(onSubmit, onError)} $type="modal">
    <Form onSubmit={handleSubmit(onSubmit)} $type="modal">
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isCreatingCabin}
          {...register("name", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isCreatingCabin}
          {...register("maxCapacity", {
            required: "This field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isCreatingCabin}
          {...register("regularPrice", {
            required: "This field is required",
            min: { value: 1, message: "Price should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isCreatingCabin}
          {...register("discount", {
            required: "This field is required",
            validate: (value) =>
              Number(value) <= Number(getValues().regularPrice) ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          defaultValue=""
          disabled={isCreatingCabin}
          {...register("description", { required: "This field is required" })}
        />
      </FormRow>

      <FormRow label="Image" error={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isCreatingCabin}
          {...register("image", { required: "This field is required" })}
        />
      </FormRow>

      <ButtonRow>
        <Button $variation="secondary" $size="medium" type="reset">
          Cancel
        </Button>
        <Button $variation="primary" $size="medium" disabled={isCreatingCabin}>
          {isCreatingCabin ? "Creating cabin..." : "Add Cabin"}
        </Button>
      </ButtonRow>
    </Form>
  );
}

export default CreateCabinForm;
