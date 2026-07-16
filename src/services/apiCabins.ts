import { supabase } from "./supabae-client";
import type { CabinsType, CreateCabinType } from "../types/CabinType";

export async function getCabins(): Promise<CabinsType> {
  const { data, error } = await supabase.from("cabins").select();

  if (error) {
    console.log(error);
    throw new Error("Cabins could not be loaded");
  }

  return data;
}

export async function createCabin(newCabin: CreateCabinType) {
  const { data, error } = await supabase.from("cabins").insert([newCabin]);

  if (error) {
    console.log(error);
    throw new Error("Cabin could not be created");
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
