import { supabase, supabaseUrl } from "./supabae-client";
import type {
  CabinsType,
  CabinType,
  CreateCabinType,
} from "../types/CabinType";

export async function getCabins(): Promise<CabinsType> {
  const { data, error } = await supabase.from("cabins").select();

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createCabin(newCabin: CreateCabinType) {
  let hasImagePath;

  if (newCabin.image instanceof File) {
    hasImagePath = false;
  } else {
    hasImagePath = true;
  }

  const imageName = `${Math.random()}-${(newCabin.image as File).name}`.replace(
    "/",
    ""
  );

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabins-images/${imageName}`;

  // 1) Create Cabin
  const { data, error } = await supabase
    .from("cabins")
    .insert([{ ...newCabin, image: imagePath }])
    .select();

  if (error || !data) {
    console.log(error);
    throw new Error("Cabin could not be created");
  }

  // if (!data) {
  //   throw new Error("No data returned after cabin creation");
  // }

  // const cabinId: CabinType = data[0].id;

  // 2) Upload image
  const { error: storageError } = await supabase.storage
    .from("cabins-images")
    .upload(imageName, newCabin.image);

  // 3) Delete the cabin IF there was an error uploading imgae
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data[0].id);
    console.error(storageError);
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be deleted");
  }

  return data;
}
